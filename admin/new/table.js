// Read a table (CSV, TSV or Excel .xlsx, uploaded or from a link) and turn it into an archive's records and settings.
// The same rules as scripts/table_ingest.py (the command-line twin used by scripts/new_site.py --table); keep the two in step.
// No page code in here, so it can be tried in Node:  node -e 'import("./table.js")'.

const IMG = /\.(jpe?g|png|tiff?|webp|avif|gif)$/i;
const URLRE = /^https?:\/\//i;
const num = (v) => { const f = Number(v); return Number.isInteger(f) && Math.abs(f) < 1e15 ? String(f) : String(Number(f.toPrecision(15))); };

// ---------------------------------------------------------------- reading
export function directUrl(u) {
  let m = u.match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([\w-]+)/);
  if (m && !/output=|\/export/.test(u)) { const g = u.match(/[#&?]gid=(\d+)/); return `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv${g ? "&gid=" + g[1] : ""}`; }
  m = u.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  m = u.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
  if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3].split("?")[0]}`;
  try { const p = new URL(u); if (p.hostname.endsWith("dropbox.com")) { p.searchParams.set("dl", "1"); return p.toString(); } } catch { /* not a URL */ }
  return u;
}

export async function fetchTable(url, sheet) {
  let r;
  try { r = await fetch(directUrl(url.trim())); } catch {
    throw new Error("The browser could not open that link (many sites don't allow it). Download the file and upload it here instead, or for a Google Sheet use File → Share → Publish to web → CSV and paste that link.");
  }
  if (!r.ok) throw new Error(`The link answered ${r.status}.`);
  return readTable(new Uint8Array(await r.arrayBuffer()), sheet);
}

export async function readFile(file, sheet) { return readTable(new Uint8Array(await file.arrayBuffer()), sheet); }

export async function readTable(bytes, sheet) {
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return tidy(await parseXlsx(bytes, sheet));
  const head = new TextDecoder().decode(bytes.slice(0, 20)).trimStart().toLowerCase();
  if (head.startsWith("<!doctype") || head.startsWith("<html")) throw new Error("That link gave a web page, not a table (is the sheet shared with anyone who has the link?).");
  let text;
  try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { text = new TextDecoder("windows-1252").decode(bytes); }
  return tidy(parseCsv(text.replace(/^﻿/, "")));
}

export function parseCsv(text) {
  const first = text.split("\n", 1)[0];
  const delim = [",", ";", "\t"].map((d) => [d, first.split(d).length - 1]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// --- a small .xlsx reader: unzip (browser DecompressionStream) + the few XML parts a sheet needs
async function unzip(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let e = bytes.length - 22;
  while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error("Not an Excel file.");
  const count = dv.getUint16(e + 10, true); let p = dv.getUint32(e + 16, true);
  const files = {};
  for (let i = 0; i < count; i++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
    const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nlen));
    files[name] = { method, csize, off };
    p += 46 + nlen + xlen + clen;
  }
  return async (name) => {
    const f = files[name]; if (!f) return null;
    const lh = f.off, start = lh + 30 + dv.getUint16(lh + 26, true) + dv.getUint16(lh + 28, true);
    const raw = bytes.subarray(start, start + f.csize);
    if (f.method === 0) return new TextDecoder().decode(raw);
    const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  };
}
const unesc = (s) => s.replace(/&(#x?[0-9a-fA-F]+|lt|gt|amp|quot|apos);/g, (_, c) =>
  c[0] === "#" ? String.fromCodePoint(c[1] === "x" ? parseInt(c.slice(2), 16) : +c.slice(1)) : { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" }[c]);
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:]+)="([^"]*)"/g)].map((m) => [m[1], unesc(m[2])]));
const texts = (s) => [...s.matchAll(/<t\b[^>]*?(?:\/>|>([\s\S]*?)<\/t>)/g)].map((m) => unesc(m[1] || "")).join("");
const colIndex = (ref) => [...ref.match(/^[A-Z]+/)[0]].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;

async function parseXlsx(bytes, sheet) {
  const get = await unzip(bytes);
  const wb = await get("xl/workbook.xml");
  const rels = Object.fromEntries([...(await get("xl/_rels/workbook.xml.rels")).matchAll(/<Relationship\b[^>]*>/g)].map((m) => { const a = attrs(m[0]); return [a.Id, a.Target]; }));
  const sheets = [...wb.matchAll(/<sheet\b[^>]*>/g)].map((m) => { const a = attrs(m[0]); return [a.name, rels[a["r:id"]]]; });
  if (!sheets.length) throw new Error("The workbook has no sheets.");
  let pick = sheets[0];
  if (sheet) {
    pick = sheets.find((s) => s[0] === sheet) || (/^\d+$/.test(sheet) ? sheets[+sheet - 1] : null);
    if (!pick) throw new Error(`No sheet “${sheet}”. Sheets: ${sheets.map((s) => s[0]).join(", ")}`);
  }
  const target = pick[1].replace(/^\//, ""), path = target.startsWith("xl/") ? target : "xl/" + target;
  const sst = await get("xl/sharedStrings.xml");
  const shared = sst ? [...sst.matchAll(/<si\b[^>]*?(?:\/>|>([\s\S]*?)<\/si>)/g)].map((m) => texts(m[1] || "")) : [];
  const dateXf = new Set(), styles = await get("xl/styles.xml");
  if (styles) {
    const custom = Object.fromEntries([...styles.matchAll(/<numFmt\b[^>]*>/g)].map((m) => { const a = attrs(m[0]); return [+a.numFmtId, a.formatCode || ""]; }));
    const xfs = (styles.match(/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/) || [, ""])[1];
    [...xfs.matchAll(/<xf\b[^>]*?(?:\/>|>)/g)].forEach((m, i) => {
      const f = +(attrs(m[0]).numFmtId || 0), code = (custom[f] || "").replace(/"[^"]*"|\[[^\]]*\]|\\./g, "");
      if ((f >= 14 && f <= 22) || (f >= 45 && f <= 47) || (f in custom && /[ymd]/i.test(code) && !/[#0]/.test(code))) dateXf.add(i);
    });
  }
  const grid = [];
  for (const rm of (await get(path)).matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const cells = [];
    for (const cm of (rm[2] || "").matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const a = attrs(cm[1]), body = cm[2] || "", v = (body.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      let val;
      if (a.t === "inlineStr") val = texts(body);
      else if (v === undefined) continue;
      else if (a.t === "s") val = shared[+v] ?? "";
      else if (a.t === "str") val = unesc(v);
      else if (a.t === "e") val = "";
      else if (a.t === "b") val = v === "1" ? "TRUE" : "FALSE";
      else if (dateXf.has(+(a.s || 0))) {
        const d = new Date(Date.UTC(1899, 11, 30) + Math.round(+v * 86400000)), iso = d.toISOString();
        val = iso.slice(11, 16) === "00:00" ? iso.slice(0, 10) : iso.slice(0, 10) + " " + iso.slice(11, 16);
      } else val = num(v);
      cells[colIndex(a.r)] = val;
    }
    const r = rm[1].match(/\br="(\d+)"/); const at = r ? +r[1] - 1 : grid.length;
    while (grid.length < at) grid.push([]);
    grid.push(Array.from(cells, (c) => c ?? ""));
  }
  return grid;
}

export function tidy(grid) {
  grid = grid.map((r) => r.map((c) => String(c ?? "").trim()));
  let i = grid.findIndex((r) => r.filter(Boolean).length >= 2);
  if (i < 0) i = Math.max(0, grid.findIndex((r) => r.some(Boolean)));
  const head = grid[i] || [], body = grid.slice(i + 1);
  const width = Math.max(head.length, ...body.map((r) => r.length), 0);
  const names = [], seen = {};
  for (let j = 0; j < width; j++) {
    let name = (head[j] || "").replace(/\s+/g, " ");
    if (!name && !body.some((r) => r[j])) { names.push(null); continue; }
    name = name || `Column ${j + 1}`;
    seen[name] = (seen[name] || 0) + 1;
    names.push(seen[name] === 1 ? name : `${name} (${seen[name]})`);
  }
  const headers = names.filter(Boolean), rows = [];
  for (const r of body) {
    const d = {}; names.forEach((n, j) => { if (n) d[n] = r[j] || ""; });
    if (Object.values(d).some(Boolean)) rows.push(d);
  }
  return { headers, rows };
}

// ---------------------------------------------------------------- what the table holds
const stats = (headers, rows) => Object.fromEntries(headers.map((h) => {
  const v = rows.map((r) => r[h]).filter(Boolean);
  return [h, { n: v.length, distinct: new Set(v).size, avg: v.length ? v.reduce((s, x) => s + x.length, 0) / v.length : 0 }];
}));
const first = (headers, patterns, skip) => { for (const p of patterns) for (const h of headers) if (p.test(h) && !(skip && skip.test(h))) return h; return null; };
const fileName = (v) => { v = (v || "").trim(); if (!URLRE.test(v)) return v; const t = v.split("?")[0].split("#")[0].split("/").pop(); try { return decodeURIComponent(t); } catch { return t; } };
const plural = (w) => (/(s|x|ch|sh)$/.test(w) ? w + "es" : w + "s");
const widen = (h) => h.charAt(0).toUpperCase() + h.slice(1);
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const uniq = (a) => [...new Set(a)];

export function detect(headers, rows, o = {}) {
  const S = stats(headers, rows), n = rows.length;
  const pick = (name) => { if (!headers.includes(name)) throw new Error(`No column “${name}”.`); return name; };
  const c = {};
  if (o.fileColumn) c.file = pick(o.fileColumn);
  else {
    const cands = headers.filter((h) => S[h].n && rows.filter((r) => IMG.test(fileName(r[h]))).length >= 0.8 * S[h].n);
    c.file = cands.find((h) => /file|image|photo|picture/i.test(h)) || cands[0] || null;
  }
  c.id = o.idColumn ? pick(o.idColumn)
    : headers.find((h) => /^(id|identifier|inventory ?(no\.?|number|#)|catalog(ue)? ?(no\.?|number))$/i.test(h) && S[h].n === n && S[h].distinct === n) || null;
  c.title = o.titleColumn ? pick(o.titleColumn) : first(headers, [/^title$/i, /^caption$/i, /^name$/i, /^description$/i]);
  c.subject = first(headers, [/^subject$/i], /date/i);
  c.location = first(headers, [/^(location|place|site|find ?spot)$/i]);
  c.creator = first(headers, [/^(creator|photographer|author)$/i]);
  c.date = first(headers, [/^date of subject$/i, /^subject date$/i, /^date$/i]) || first(headers, [/date|period/i], /digiti|creat|modif|added|upload|record/i);
  c.created = first(headers, [/date created|year (photographed|created|taken)|created|photographed|date taken/i], /digiti|modif|upload/i);
  if (c.created === c.date) c.created = null;
  c.geo = first(headers, [/georef|coordinates|lat.?(lon|lng)|^geo/i]);
  c.group = o.groupColumn ? pick(o.groupColumn)
    : headers.find((h) => /\b(box|folder|roll|series|group|collection|album)\b/i.test(h) && S[h].distinct >= 2 && S[h].distinct <= Math.max(3, Math.floor(n / 3)) && S[h].n >= 0.5 * n) || null;
  return { c, S };
}

// cfg: the site's site.json (filled in); o: { fileColumn, idColumn, titleColumn, groupColumn }.
// Changes cfg, returns { recHeaders, recRows, features, notes }.
export function ingest(cfg, headers, rows, o = {}) {
  const { c, S } = detect(headers, rows, o), n = rows.length, notes = [];
  if (!n) throw new Error("The table has no rows.");
  if (!c.file) throw new Error("No column holds image file names (values ending .jpg, .png, .tif …). Choose it under Columns.\nColumns: " + headers.join(", "));
  const F = cfg.fields, one = cfg.noun.one, many = cfg.noun.many, prefix = cfg.build.idPrefix, base = cfg.imageBase;

  const idF = c.id || "ID", titleF = c.title || "Title";
  const recHeaders = [idF, ...headers.filter((h) => h !== idF)];
  if (!recHeaders.includes(titleF)) recHeaders.splice(1, 0, titleF);
  let urlF = "Image_URL"; while (recHeaders.includes(urlF)) urlF += "_";
  recHeaders.push(urlF);
  const used = {}, dups = [], noFile = [], recRows = [];
  rows.forEach((r, k) => {
    const i = k + 2, fn = fileName(r[c.file]);
    const rec = Object.fromEntries(recHeaders.map((h) => [h, r[h] ?? ""]));
    rec[c.file] = fn;
    let rid = c.id ? r[idF] || "" : fn.replace(IMG, "");
    if (!rid) { noFile.push(i); rid = `${prefix}${String(i - 1).padStart(6, "0")}`; }
    used[rid] = (used[rid] || 0) + 1;
    if (used[rid] > 1) { dups.push([i, rid]); rid = `${rid}-${used[rid]}`; }
    rec[idF] = rid;
    if (fn) rec[urlF] = URLRE.test(r[c.file] || "") ? r[c.file] : base + encodeURIComponent(fn);
    recRows.push(rec);
  });
  if (dups.length) notes.push(`${dups.length} rows share an image file name or ID with an earlier row; their IDs got -2, -3 … (${dups.slice(0, 10).map(([i, v]) => `row ${i}: ${v}`).join(", ")}${dups.length > 10 ? " …" : ""})`);
  if (noFile.length) notes.push(`${noFile.length} rows have no image file name (IDs ${prefix}…): rows ${noFile.slice(0, 10).join(", ")}`);

  F.id = idF; F.title = titleF;
  F.images = [{ field: c.file, urlField: urlF }];
  F.titleFallback = [c.subject, idF].filter((x) => x && x !== titleF);
  F.location = c.location || "";
  const hasGeo = !!c.geo && rows.some((r) => r[c.geo]);
  F.geo = hasGeo ? c.geo : "";
  F.caption = [c.location, c.created ? "_cy" : null].filter(Boolean); if (!F.caption.length) F.caption = [idF];
  F.boardCaption = [c.subject, c.location].filter(Boolean); if (!F.boardCaption.length) F.boardCaption = [idF];
  const photo = ["slide", "photo", "photograph", "image", "negative", "positive", "print"].includes(one);
  if (c.date) F.date = { field: c.date, label: c.date, year: `${c.date} (year)`, century: `${c.date} (century)` };
  if (c.created) F.created = { field: c.created, label: photo ? "Year photographed" : "Year created", decade: photo ? "Decade photographed" : "Decade created" };
  cfg.labels = { [urlF]: "Full-size image" };

  const skip = new Set([idF, titleF, c.file, urlF, c.geo, c.date, c.created]);
  const konst = new Set(headers.filter((h) => S[h].n >= 0.9 * n && S[h].distinct === 1));
  const facets = headers.filter((h) => !skip.has(h) && !konst.has(h) && S[h].distinct >= 2 && S[h].distinct <= Math.min(300, Math.max(5, Math.floor(n / 5))) && S[h].avg < 60);
  const textual = headers.filter((h) => S[h].avg > 45 && S[h].n);
  const dataCols = headers.filter((h) => S[h].n || h === c.geo);

  if (c.group) {
    const g = c.group, word = g.trim().split(/[\s_]+/).pop().toLowerCase(), pl = plural(word), stem = g.slice(0, g.length - word.length).replace(/[ _]+$/, "");
    cfg.group = { field: g, nav: (stem ? stem + " " : "") + widen(pl), tab: widen(pl), plural: pl, one: word, items: [one, many], numbered: false, photos: false, hint: `Open a ${word} to see its ${many}.` };
    cfg.groupable = [g, ...[c.location, c.subject, c.creator].filter((h) => h && h !== g)];
    if (!cfg.views.includes("boxes")) cfg.views = ["gallery", "boxes", "table"];
  }
  cfg.facetFields = facets;
  cfg.linkFields = [c.location, c.group].filter(Boolean);
  cfg.groupable = uniq([...(cfg.groupable || []), ...facets.filter((h) => S[h].distinct <= 60)]);
  const ordered = [c.subject, c.location, c.date, c.created, c.group].filter(Boolean);
  const shown = facets.filter((h) => S[h].distinct >= 3);
  cfg.keyFields = uniq([titleF, ...ordered, ...shown.filter((h) => !ordered.includes(h))]).slice(0, 8);
  const tcols = uniq([idF, titleF, ...ordered, ...shown.filter((h) => !ordered.includes(h)), c.file]);
  cfg.table = { cols: [...tcols.slice(0, 10), "URI"], widths: {} };
  for (const h of tcols.slice(0, 10)) if (S[h] && h !== idF) cfg.table.widths[h] = Math.trunc(clamp(S[h].avg * 7, 90, 320));
  cfg.table.widths[idF] = 150;
  const sorts = [["f:" + idF, idF === "ID" ? "ID order" : widen(idF) + " order"], ["title", "Title A–Z"]];
  if (c.group) sorts.unshift(["box", `${widen(cfg.group.one)} order`]);
  if (c.date) sorts.push(["subjOld", "Subject date, oldest"], ["subjNew", "Subject date, newest"]);
  if (c.created) sorts.push(["photoOld", `${photo ? "Photographed" : "Created"}, oldest`], ["photoNew", `${photo ? "Photographed" : "Created"}, newest`]);
  if (c.location) sorts.push(["loc", "Location A–Z"]);
  cfg.sorts = sorts;
  cfg.searchPlaceholder = "Search " + [titleF, c.subject, c.location, c.group].filter(Boolean).map((h) => h.toLowerCase()).join(", ") + "…";
  const defaults = {};
  for (const h of headers) if (konst.has(h) && !skip.has(h)) defaults[h] = rows.find((r) => r[h])[h];
  const widths = {};
  for (const h of dataCols) if (S[h] && h !== idF) widths[h] = Math.trunc(clamp(S[h].avg * 7, 90, 300));
  widths[urlF] = 260;
  cfg.editor = {
    readOnly: [], defaultCols: [...dataCols.filter((h) => h !== idF), urlF], widths,
    categorical: uniq([...facets, ...(c.date ? [c.date] : [])]),
    textarea: uniq([titleF, ...textual]).filter((h) => recHeaders.includes(h)),
    issues: [...[titleF, c.location, c.created].filter(Boolean).map((x) => `missing:${x}`), ...(hasGeo ? ["no-geo", "bad-geo"] : []), "dup-file", "no-image"],
    upload: { fields: [c.group, c.location, c.created, c.creator, ...facets].filter(Boolean).slice(0, 9), defaults },
  };

  const sugg = [], stack = facets.filter((h) => S[h].distinct <= 12).slice(0, 2);
  if (c.location) sugg.push({ title: `${widen(many)} by location`, type: "bar", x: c.location, top: 15, note: "Where they were taken" });
  if (c.date) sugg.push({ title: "Subjects across time", type: "column", x: F.date.year, bin: 100, note: "Century of the thing shown" });
  if (c.created) sugg.push({ title: `${widen(many)} per year`, type: "line", x: F.created.label, bin: 1, note: "By year" });
  for (const h of stack.slice(0, 1)) sugg.push({ title: `Share by ${h.toLowerCase()}`, type: "pie", x: h, note: h });
  if (c.group) sugg.push({ title: `${widen(cfg.group.plural)} by size`, type: "bar", x: c.group, top: 20, sort: "value", note: "Largest first" });
  if (c.creator) sugg.push({ title: `${widen(many)} by ${c.creator.toLowerCase()}`, type: "donut", x: c.creator, note: c.creator });
  if (c.location && c.date) sugg.push({ title: "Top locations by century", type: "stacked", x: c.location, top: 10, series: F.date.century, note: "Stacked columns" });
  cfg.charts = { defaultX: c.location || c.group || facets[0] || idF, stackSeries: stack, defaults: [...Array(Math.min(3, sugg.length)).keys()], suggestions: sugg };
  if (!(sugg.length || facets.length)) cfg.views = cfg.views.filter((v) => v !== "charts");
  else if (!cfg.views.includes("charts")) cfg.views = [...cfg.views, "charts"];

  const only = !!c.location && rows.some((r) => /isthmia|ισθμια/i.test(r[c.location] || ""));
  cfg.hub = { type: widen(one), area: "", trench: "", people: "", year: "", search: [titleF, c.subject, c.group].filter(Boolean),
    only: only ? "isthmia|ισθμια" : "", ...(only ? { onlyFields: [c.location] } : {}), cut: false };
  cfg.build.dict = recHeaders.filter((h) => S[h] && S[h].n && S[h].distinct <= Math.max(20, n * 0.4));

  const features = { boxes: !!c.group, charts: cfg.views.includes("charts"), map: hasGeo ? "view" : false, sitePhoto: false, scaleBar: false };
  const found = Object.entries(c).filter(([, v]) => v).map(([k, v]) => `${k} = ${v}`).join("; ");
  notes.unshift(`${n.toLocaleString("en-US")} rows, ${headers.length} columns. Detected: ${found}${c.id ? "" : "; ID = file name without its extension"}`);
  if (konst.size) notes.push("Same value in every row (editor defaults for new images, not filters): " + [...konst].sort().join(", "));
  return { recHeaders, recRows, features, notes, roles: c };
}

// ---------------------------------------------------------------- writing
const cell = (v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export const toCsv = (headers, rows) => [headers.map(cell).join(","), ...rows.map((r) => headers.map((h) => cell(r[h] ?? "")).join(","))].join("\n") + "\n";
export function shards(headers, rows, size = 1000) {
  const out = [];
  for (let i = 0; i < Math.max(rows.length, 1); i += size) out.push(toCsv(headers, rows.slice(i, i + size)));
  return out;  // 0001.csv, 0002.csv, …
}
