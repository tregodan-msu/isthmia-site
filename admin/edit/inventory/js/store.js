// The catalog, read from and saved to the private repo with the GitHub key (no other backend).
//
// An archive's records are CSV files in sites/<site>/data/records/ (0001.csv, 0002.csv, … up to 1,000 rows each;
// see scripts/records.py). Loading fetches every file; files are cached on the device by their git hash, so opening
// the editor again only downloads files that changed. Saving commits only the files whose rows changed, in one commit,
// with a per-cell check: an edit is refused if the cell no longer holds the value this device loaded (someone else
// saved it first). Git history is the version history; history() and undoChanges() read it.
import { gh, API, H } from "./gate.js";

const CFG = window.GA_CONFIG;
const BRANCH = CFG.adminBranch || "main";
const SITE = CFG.key;
const DIR = `sites/${SITE}/data/records`;
const SHARD = 1000;
const ID_FIELD = (CFG.fields && CFG.fields.id) || "ID";
const PREFIX = CFG.idPrefix || "R";
const FORMER = CFG.formerIds || "";

// ------------------------------------------------------------------ CSV (same dialect as Python's csv module, "\n" line ends)
export function parseCSV(text) {
  const rows = []; let row = [], f = "", i = 0, q = false;
  if (text.charCodeAt(0) === 0xfeff) i = 1;
  for (; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  return rows;
}
const cell = (v) => { v = v == null ? "" : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
export function toCSV(headers, rows) {
  let s = headers.map(cell).join(",") + "\n";
  for (const r of rows) s += headers.map((h) => cell(r[h])).join(",") + "\n";
  return s;
}
function parseFile(text) {
  const t = parseCSV(text), headers = (t.shift() || []).map(String);
  return { headers, rows: t.filter((r) => r.some((v) => v !== "")).map((r) => Object.fromEntries(headers.map((h, j) => [h, r[j] ?? ""]))) };
}

// ------------------------------------------------------------------ GitHub
async function call(path, opts = {}, raw = false) {
  if (!gh.token) throw new Error("Locked: enter the GitHub key first.");
  const headers = { ...H(gh.token), ...(raw ? { Accept: "application/vnd.github.raw+json" } : {}), ...(opts.body ? { "Content-Type": "application/json" } : {}) };
  let res;
  try { res = await fetch(API + "/repos/" + gh.repo + path, { cache: "no-store", ...opts, headers }); }
  catch { throw new Error("Couldn’t reach GitHub. Check the connection and try again."); }
  if (!res.ok) {
    const e = new Error(`GitHub said ${res.status}${res.status === 401 ? " (the key was refused)" : ""}: ${(await res.text()).slice(0, 160)}`);
    e.status = res.status; throw e;
  }
  return raw ? res.text() : res.status === 204 ? null : res.json();
}
const post = (path, body, method = "POST") => call(path, { method, body: JSON.stringify(body) });
const head = async () => (await call(`/git/ref/heads/${BRANCH}`)).object.sha;
async function listing(ref) {
  try { return (await call(`/contents/${DIR}?ref=${ref}`)).filter((x) => x.type === "file" && /\.csv$/i.test(x.name)).sort((a, b) => a.name.localeCompare(b.name)); }
  catch (e) { if (e.status === 404) return []; throw e; }
}

// blobs never change for a given hash, so they are kept on the device (IndexedDB) and reused
const idb = (() => {
  let p;
  const open = () => (p ||= new Promise((ok, no) => { const r = indexedDB.open("isthmia-records", 1); r.onupgradeneeded = () => r.result.createObjectStore("blobs"); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }));
  const tx = async (mode, fn) => { try { const db = await open(); return await new Promise((ok, no) => { const t = db.transaction("blobs", mode), q = fn(t.objectStore("blobs")); t.oncomplete = () => ok(q && q.result); t.onerror = () => no(t.error); }); } catch { return undefined; } };
  return { get: (k) => tx("readonly", (s) => s.get(k)), put: (k, v) => tx("readwrite", (s) => s.put(v, k)), keys: () => tx("readonly", (s) => s.getAllKeys()), del: (k) => tx("readwrite", (s) => s.delete(k)) };
})();
async function blob(sha) {
  const hit = await idb.get(sha);
  if (typeof hit === "string") return hit;
  const text = await call(`/git/blobs/${sha}`, {}, true);
  idb.put(sha, text);
  return text;
}
async function readFiles(list, onProgress) {
  let done = 0;
  const out = new Array(list.length);
  const q = list.map((x, i) => async () => { out[i] = { name: x.name, path: x.path, sha: x.sha, ...parseFile(await blob(x.sha)) }; onProgress && onProgress(++done, list.length); });
  await Promise.all(Array.from({ length: 6 }, async () => { while (q.length) await q.shift()(); }));
  return out;
}

// ------------------------------------------------------------------ state
const S = { head: null, files: [] };
const idOf = (r) => String(r[ID_FIELD] || "");
function headersOf(files) { const hs = []; for (const f of files) for (const h of f.headers) if (h && !hs.includes(h)) hs.push(h); return hs; }

/** Loads every record. Returns {headers, records}; each record is a plain object of its columns plus _id. */
export async function load(onProgress) {
  S.head = await head();
  S.files = await readFiles(await listing(S.head), onProgress);
  const keep = new Set(S.files.map((f) => f.sha));  // forget cached files no longer in use
  idb.keys().then((ks) => (ks || []).forEach((k) => { if (!keep.has(k)) idb.del(k); }));
  return snapshot();
}
function snapshot() {
  const records = [];
  S.files.forEach((f) => f.rows.forEach((r) => records.push({ ...r, _id: idOf(r) })));
  return { headers: headersOf(S.files), records, head: S.head };
}

function nextIds(files, n) {
  let max = 0;
  const re = new RegExp("^" + PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\d+)$");
  for (const f of files) for (const r of f.rows) {
    for (const id of [idOf(r), ...(FORMER ? String(r[FORMER] || "").split(/[\s,;]+/) : [])]) { const m = id.match(re); if (m) max = Math.max(max, +m[1]); }
  }
  const w = Math.max(6, String(max + n).length);
  return Array.from({ length: n }, (_, k) => PREFIX + String(max + 1 + k).padStart(w, "0"));
}

/**
 * Saves edits and new records in one commit.
 *   changes: [{id, field, value, old}]   old = the value this device loaded; the edit is refused if the cell changed since
 *   appends: [{field: value}]            new records; they get the next ID (or keep their own, for archives with their own IDs)
 * Returns {written, conflicts: [{id, field, current, value}], missing: [id], ids: [new ids], commit}.
 */
export async function save(changes = [], appends = [], note = "") {
  for (let attempt = 0; attempt < 4; attempt++) {
    const tip = await head();
    let files = S.files;
    if (tip !== S.head) {  // someone saved since this device loaded: start from their version
      const list = await listing(tip), mine = new Map(S.files.map((f) => [f.path, f]));
      files = await readFiles(list.filter((x) => !mine.has(x.path) || mine.get(x.path).sha !== x.sha));
      const fresh = new Map(files.map((f) => [f.path, f]));
      files = list.map((x) => fresh.get(x.path) || mine.get(x.path));
    }
    files = files.map((f) => ({ ...f, headers: f.headers.slice(), rows: f.rows.map((r) => ({ ...r })), dirty: false }));
    const where = new Map();
    files.forEach((f) => f.rows.forEach((r) => where.set(idOf(r), { f, r })));
    const conflicts = [], missing = [], log = [];
    for (const c of changes) {
      const w = where.get(String(c.id));
      if (!w) { missing.push(c.id); continue; }
      const cur = w.r[c.field] ?? "", v = String(c.value ?? "");
      if (cur === v) continue;
      if (c.old !== undefined && c.old !== null && cur !== String(c.old)) { conflicts.push({ id: c.id, field: c.field, current: cur, value: v }); continue; }
      if (!w.f.headers.includes(c.field)) w.f.headers.push(c.field);
      w.r[c.field] = v; w.f.dirty = true;
      log.push(`${c.id} · ${c.field}: ${short(cur)} → ${short(v)}`);
    }
    const ids = [];
    if (appends.length) {
      const own = ID_FIELD !== "ID";
      const fresh = own ? [] : nextIds(files, appends.length);
      appends.forEach((a, k) => {
        const id = own ? String(a[ID_FIELD] || "") : fresh[k];
        if (!id || where.has(id)) throw new Error(own ? `New record needs a unique ${ID_FIELD}${id ? ` (${id} exists)` : ""}.` : "Could not number the new record.");
        let f = files[files.length - 1];
        if (!f || f.rows.length >= SHARD) {
          const name = String(files.length + 1).padStart(4, "0") + ".csv";
          f = { name, path: `${DIR}/${name}`, sha: null, headers: headersOf(files).length ? headersOf(files) : [ID_FIELD], rows: [], dirty: true };
          files.push(f);
        }
        const r = { ...a, [ID_FIELD]: id };
        for (const h of Object.keys(r)) if (!f.headers.includes(h)) f.headers.push(h);
        f.rows.push(r); f.dirty = true; ids.push(id); where.set(id, { f, r });
        log.push(`${id} · new record`);
      });
    }
    const dirty = files.filter((f) => f.dirty);
    if (!dirty.length) { S.files = files.map(clean); S.head = tip; return { written: 0, conflicts, missing, ids, commit: null, ...snapshot() }; }

    // one commit with every changed file
    const tree = [];
    for (const f of dirty) {
      const text = toCSV(f.headers, f.rows);
      const b = await post("/git/blobs", { content: text, encoding: "utf-8" });
      f.sha = b.sha; idb.put(b.sha, text);
      tree.push({ path: f.path, mode: "100644", type: "blob", sha: b.sha });
    }
    const base = (await call(`/git/commits/${tip}`)).tree.sha;
    const t = await post("/git/trees", { base_tree: base, tree });
    const n = log.length;
    const title = `${SITE}: ${changes.length ? `${n - ids.length} edit${n - ids.length === 1 ? "" : "s"}` : ""}${changes.length && ids.length ? ", " : ""}${ids.length ? `${ids.length} new record${ids.length === 1 ? "" : "s"}` : ""}${gh.user ? ` (${gh.user})` : ""}`;
    const body = (note ? note + "\n\n" : "") + log.slice(0, 200).join("\n") + (n > 200 ? `\n… and ${n - 200} more` : "");
    const commit = await post("/git/commits", { message: title + "\n\n" + body, tree: t.sha, parents: [tip] });
    try { await post(`/git/refs/heads/${BRANCH}`, { sha: commit.sha, force: false }, "PATCH"); }
    catch (e) { if (e.status === 422 || e.status === 409) continue; throw e; }   // someone saved in between: redo on top of theirs
    S.head = commit.sha; S.files = files.map(clean);
    return { written: n - ids.length, conflicts, missing, ids, commit: commit.sha, ...snapshot() };
  }
  throw new Error("Several people are saving at once. Wait a moment and save again.");
}
const clean = (f) => { const { dirty, ...rest } = f; return rest; };
const short = (v) => { v = String(v ?? ""); return v === "" ? "(empty)" : v.length > 60 ? v.slice(0, 57) + "…" : v.replace(/\s+/g, " "); };

/** Rebuilds the public site(s) from the records now in the repo (about 2 minutes). */
export async function publish() {
  await post("/dispatches", { event_type: "publish", client_payload: { site: SITE } });
}

/** The latest saves to this archive's records: [{sha, parent, when, who, title, body, url}]. */
export async function history(n = 30) {
  const list = await call(`/commits?sha=${BRANCH}&path=${encodeURIComponent(DIR)}&per_page=${n}`);
  return list.map((c) => {
    const [title, ...rest] = c.commit.message.split("\n");
    return { sha: c.sha, parent: (c.parents[0] || {}).sha, when: c.commit.author.date, who: (c.author && c.author.login) || c.commit.author.name, title, body: rest.join("\n").trim(), url: c.html_url };
  });
}

/** What a save changed: [{id, field, before, after}] plus ids of records it added (those can't be undone here). */
export async function changesIn(sha, parent) {
  const [a, b] = await Promise.all([parent ? listing(parent) : [], listing(sha)]);
  const before = new Map(a.map((x) => [x.path, x.sha]));
  const changed = b.filter((x) => before.get(x.path) !== x.sha);
  const now = await readFiles(changed), old = await readFiles(a.filter((x) => changed.some((c) => c.path === x.path)));
  const oldRows = new Map(); old.forEach((f) => f.rows.forEach((r) => oldRows.set(idOf(r), r)));
  const out = [], added = [];
  for (const f of now) for (const r of f.rows) {
    const o = oldRows.get(idOf(r));
    if (!o) { added.push(idOf(r)); continue; }
    for (const k of new Set([...Object.keys(r), ...Object.keys(o)])) if ((r[k] ?? "") !== (o[k] ?? "")) out.push({ id: idOf(r), field: k, before: o[k] ?? "", after: r[k] ?? "" });
  }
  return { changes: out, added };
}
