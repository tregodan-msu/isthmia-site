// New archive site (locked with the GitHub key). Fills in template.json (written by scripts/build.py from
// scripts/new_site.py, so this page and the script make the same files) and commits them to the private repo in one
// commit: sites/<key>/site.json, an empty records file, its scripts/ folder, its features.json entry, and the bucket
// policy and CORS in aws/<key>/. The commit publishes; the new site's public repo is created here if the key may,
// otherwise the page says how. Nothing is sent to AWS.
// With a table (upload or link; admin/new/table.js, the twin of scripts/table_ingest.py) the records come from its rows
// and the settings are worked out from its columns.
import { gh, H, API, getText, putFiles } from "../../js/gate.js";
import { readFile, fetchTable, ingest, shards } from "./table.js";
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const T = await (await fetch("template.json", { cache: "no-cache" })).json();
const OWNER = T.account;
const form = $("#f"), F = (n) => form.elements[n];
const touched = new Set();

function toast(msg, ms = 5000) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), ms); }

// fill the short name and repo from the title / bucket until edited by hand
form.addEventListener("input", (e) => {
  touched.add(e.target.name);
  const title = F("title").value.trim();
  if (!touched.has("key")) F("key").value = slug(title.replace(/^isthmia\s+/i, "")).split("-").slice(0, 2).join("-");
  if (!touched.has("sub")) F("sub").placeholder = `Isthmia Excavations · ${cap(F("many").value.trim() || "images")}`;
  if (!touched.has("description")) F("description").placeholder = `Browse the ${F("many").value.trim() || "images"} of the UCLA/OSU/MSU excavations at Isthmia.`;
  preview();
});

function values() {
  const v = Object.fromEntries([...new FormData(form)].map(([k, x]) => [k, String(x).trim()]));
  const one = v.one || "image", many = v.many || "images";
  const accent = v.accent || "#5a4a8a";
  const mix = (hex, w) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - w) + 255 * w).toString(16).padStart(2, "0")).join("");
  const dark = (hex, w) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - w)).toString(16).padStart(2, "0")).join("");
  return {
    key: v.key, title: v.title, bucket: v.bucket, owner: OWNER, repo: v.repo || "", one, many,
    path: slug(one) || "item", mark: v.mark || v.title.replace(/^isthmia\s+/i, "").charAt(0).toUpperCase() || "Ι",
    sub: v.sub || `Isthmia Excavations · ${cap(many)}`,
    description: v.description || `Browse the ${many} of the UCLA/OSU/MSU excavations at Isthmia.`,
    accent, accentInk: dark(accent, 0.22), accentSoft: mix(accent, 0.86), contact: v.contact || "freyjona@msu.edu",
    hubType: cap(one), idPrefix: (v.idPrefix || v.key.slice(0, 2)).toUpperCase(), exportName: slug(v.title),
  };
}
// No public repo given: a collection inside Isthmia Archives (the same change scripts/new_site.py makes without --repo)
function asCollection(site, v) {
  const { key, permalinkBase, ...rest } = site;
  return { key, collection: true, ...rest, permalinkPath: v.key, publish: { editor: true } };
}
// replace every @@name@@ in the template's strings
const fill = (x, v) => typeof x === "string" ? x.replace(/@@(\w+)@@/g, (_, k) => v[k] ?? "")
  : Array.isArray(x) ? x.map((y) => fill(y, v)) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, y]) => [k, fill(y, v)])) : x;

// ---- the optional table
let TBL = null;  // { name, headers, rows }
const SEL = { fileColumn: "#c-file", idColumn: "#c-id", titleColumn: "#c-title", groupColumn: "#c-group" };
const colOpts = () => Object.fromEntries(Object.entries(SEL).map(([k, s]) => [k, $(s).value || undefined]));
function runIngest(site) { return ingest(site, TBL.headers, TBL.rows, colOpts()); }
function tableSummary() {
  const out = $("#tsum");
  if (!TBL) { out.textContent = ""; $("#tcols").hidden = true; $("#tclear").hidden = true; return; }
  try {
    const v0 = values(), s0 = fill(T.siteJson, v0);
    const res = runIngest(v0.repo ? s0 : asCollection(s0, v0));
    out.innerHTML = `<b>${esc(TBL.name)}</b>: ` + res.notes.map(esc).join("<br>");
    for (const [k, s] of Object.entries(SEL)) { const role = { fileColumn: "file", idColumn: "id", titleColumn: "title", groupColumn: "group" }[k]; $(s).options[0].textContent = res.roles[role] ? `found: ${res.roles[role]}` : "none found"; }
  } catch (e) { out.innerHTML = `<span class="note">${esc(e.message).replace(/\n/g, "<br>")}</span>`; }
  $("#tclear").hidden = false; $("#tcols").hidden = false;
}
function setTable(name, t) {
  TBL = { name, ...t };
  for (const s of Object.values(SEL)) $(s).innerHTML = `<option value=""></option>` + t.headers.map((h) => `<option>${esc(h)}</option>`).join("");
  tableSummary();
}
$("#tfile").addEventListener("change", async (e) => {
  const f = e.target.files[0]; if (!f) return;
  try { setTable(f.name, await readFile(f, $("#tsheet").value.trim())); } catch (err) { toast(err.message, 9000); }
});
$("#tload").addEventListener("click", async () => {
  const u = $("#turl").value.trim(); if (!u) return toast("Paste a link first.");
  $("#tsum").textContent = "Loading…";
  try { setTable(u.split("?")[0].split("/").pop() || "table", await fetchTable(u, $("#tsheet").value.trim())); } catch (err) { $("#tsum").textContent = ""; toast(err.message, 12000); }
});
$("#turl").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("#tload").click(); } });
$("#tclear").addEventListener("click", () => { TBL = null; $("#tfile").value = ""; $("#turl").value = ""; tableSummary(); });
for (const s of Object.values(SEL)) $(s).addEventListener("change", tableSummary);
form.addEventListener("input", () => { if (TBL) tableSummary(); });

function problem(v) {
  if (!v.title) return "Give the site a name.";
  if (!/^[a-z0-9][a-z0-9-]*$/.test(v.key)) return "Short name: lower-case letters, digits and - only.";
  if (T.sites.includes(v.key)) return `There is already a site called “${v.key}”.`;
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(v.bucket)) return "Bucket: the S3 bucket's name (lower case).";
  if (v.repo && !/^[A-Za-z0-9._-]+$/.test(v.repo)) return "Public repo: a repo name (no spaces), or leave it empty for a collection.";
  return "";
}
function preview() {
  const v = values(), p = problem(v);
  $("#preview").innerHTML = p ? `<span class="note">${esc(p)}</span>` :
    (v.repo ? `Separate site: <b>https://${OWNER}.github.io/${esc(v.repo)}/</b>` : `Collection in <b>Isthmia Archives</b>`) +
    ` · editor: <b>…/admin/edit/${esc(v.key)}/</b> · images: <b>https://${esc(v.bucket)}.s3.amazonaws.com/</b> · permalinks: <b>#${esc(v.repo ? v.path : v.key)}/&lt;ID&gt;</b>`;
  $("#go").disabled = !!p;
}

async function repoExists(name) {
  const r = await fetch(`${API}/repos/${OWNER}/${name}`, { headers: H(gh.token) });
  return r.ok;
}
async function makeRepo(v) {
  if (await repoExists(v.repo)) return "exists";
  const r = await fetch(`${API}/user/repos`, { method: "POST", headers: { ...H(gh.token), "Content-Type": "application/json" },
    body: JSON.stringify({ name: v.repo, description: `${v.title}: built site (published from ${OWNER}/isthmia; do not edit)`, private: false, has_issues: false, has_wiki: false, has_projects: false }) });
  return r.ok ? "made" : "manual";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const v = values(), p = problem(v);
  if (p) return toast(p);
  $("#go").disabled = true; $("#msg").textContent = "Creating…";
  try {
    const feats = JSON.parse((await getText("features.json")) || '{"template":{},"sites":{}}');
    if (feats.sites[v.key]) throw new Error(`features.json already has a site “${v.key}”.`);
    const site = v.repo ? fill(T.siteJson, v) : asCollection(fill(T.siteJson, v), v), policy = fill(T.policy, v), cors = fill(T.cors, v);
    const res = TBL ? runIngest(site) : null;
    feats.sites[v.key] = { ...(res ? res.features : T.features) };
    const j = (o, n = 2) => JSON.stringify(o, null, n) + "\n";
    const repo = v.repo ? await makeRepo(v) : "none";
    const sha = await putFiles([
      { path: `sites/${v.key}/site.json`, text: j(site) },
      ...(res ? shards(res.recHeaders, res.recRows).map((text, i) => ({ path: `sites/${v.key}/data/records/${String(i + 1).padStart(4, "0")}.csv`, text }))
              : [{ path: `sites/${v.key}/data/records/0001.csv`, text: T.records }]),
      ...(res ? [{ path: `sites/${v.key}/import/table-report.md`, text: `# Table read for ${v.title}\n\nSource: ${TBL.name}\n\n` + res.notes.map((x) => `- ${x}`).join("\n") + "\n" }] : []),
      { path: `sites/${v.key}/scripts/README.md`, text: `One-off scripts for ${v.title} (imports, clean-ups). Kept here as a record of how the data was made.\n` },
      { path: `aws/${v.key}/bucket-policy.json`, text: j(policy) },
      { path: `aws/${v.key}/bucket-cors.json`, text: j(cors) },
      { path: "features.json", text: j(feats, 1) },
    ], `New ${v.repo ? "site" : "collection"}: ${v.title} (sites/${v.key})`);
    T.sites.push(v.key);
    form.hidden = true;
    done(v, repo, sha, policy, cors, res);
  } catch (err) { toast("Could not create the site: " + err.message, 9000); $("#msg").textContent = ""; $("#go").disabled = false; }
});

function done(v, repo, sha, policy, cors, res) {
  const site = `https://${OWNER}.github.io/${v.repo}/`, editor = `../edit/${v.key}/`;
  const box = (id, text) => `<div class="ns-code"><button class="btn small" data-copy="${id}">Copy</button><pre id="${id}">${esc(text)}</pre></div>`;
  const repoStep = repo === "none" ? "" : repo === "manual"
    ? `<li><b>Create the public repo</b> (this key may not create repos): <a href="https://github.com/new?owner=${OWNER}&name=${encodeURIComponent(v.repo)}&visibility=public" target="_blank" rel="noopener">github.com/new → ${OWNER}/${esc(v.repo)}</a>, public, empty (no README).</li>`
    : `<li>Public repo <a href="https://github.com/${OWNER}/${esc(v.repo)}" target="_blank" rel="noopener">${OWNER}/${esc(v.repo)}</a> ${repo === "made" ? "created" : "already exists"}.</li>`;
  const sec = $("#done");
  sec.innerHTML = `<h2>${esc(v.title)} is in the repo</h2>
    <p class="muted small">Commit <a href="https://github.com/${OWNER}/isthmia/commit/${sha}" target="_blank" rel="noopener">${sha.slice(0, 7)}</a>: <code>sites/${esc(v.key)}/</code>, its <code>features.json</code> entry and <code>aws/${esc(v.key)}/</code>.
      ${res ? `It has <b>${res.recRows.length.toLocaleString("en-US")} records</b> from ${esc(TBL.name)} (${res.notes.map(esc).join(" · ")}).` : "It has no records yet;"} Its editor appears on the overview after the next publish (a minute or two).</p>
    <h3>Left to do</h3>
    <ol class="ns-steps">
      ${repoStep}
      ${repo === "none" ? "" : `<li><b>Give the publish token access</b> to it: GitHub → Settings → Developer settings → Fine-grained tokens → the publish token → Repository access → add <code>${OWNER}/${esc(v.repo)}</code> (Contents: read and write).</li>`}
      <li><b>S3, bucket <code>${esc(v.bucket)}</code></b>: upload the full-size images at the top of the bucket, named as the IDs should read.
        Permissions → Block public access: off for bucket policies. Then Bucket policy:${box("pol", JSON.stringify(policy, null, 2))}and CORS:${box("cors", JSON.stringify(cors, null, 2))}</li>
      <li><b>Optimized copies</b> (400 and 1600 px, AVIF + WebP): in AWS CloudShell, upload <code>scripts/make_thumbnails.py</code>, then${box("thumbs", `pip install boto3 pillow\npython3 make_thumbnails.py --bucket ${v.bucket} --layout optimized --max-minutes 25`)}Run it again until nothing is left.</li>
      <li><b>${res ? "Images in the bucket that are not in the table" : "One record per image"}</b>${res ? " (optional: adds a record for each image file whose name is not an ID yet)" : ""}, in a clone of the private repo with AWS access:${box("recs", `python3 scripts/records_from_bucket.py ${v.key}\ngit add sites/${v.key}/data/records && git commit -m "${v.title}: records from the bucket" && git push`)}
        (No boto3: <code>aws s3 ls s3://${esc(v.bucket)}/ &gt; list.txt</code>, then add <code>--list list.txt</code>.)</li>
      <li><b>Publish</b>: <a href="https://github.com/${OWNER}/isthmia/actions/workflows/publish.yml" target="_blank" rel="noopener">Actions → Publish sites → Run workflow → ${esc(v.key)}</a>.
        ${repo === "none" ? `This publishes Isthmia Archives, where the collection appears under its own Type.` : `Then on the public repo: Settings → Pages → Deploy from a branch → <code>main</code>, <code>/ (root)</code>. The site will be at <a href="${site}" target="_blank" rel="noopener">${site}</a>.`}</li>
      <li>When the copies are all in the bucket: in <code>sites/${esc(v.key)}/site.json</code> set <code>"thumbsReady": true</code>, commit, publish.</li>
      ${repo === "none" ? "" : `<li>Write the Info pages: <a href="${editor}">editor</a> → Tools → Info pages (after the first publish).</li>`}
      <li>Later, the data: <code>python3 scripts/records.py merge ${esc(v.key)} data.csv --match "&lt;ID column&gt;"</code> (report first, then <code>--apply</code>).</li>
    </ol>
    <p><a class="btn" href="./">Start another</a> <a class="btn" href="../">Overview</a></p>`;
  sec.hidden = false;
  sec.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    navigator.clipboard.writeText($("#" + b.dataset.copy).textContent).then(() => toast("Copied"), () => toast("Couldn’t copy; select the text instead."));
  });
  scrollTo(0, 0);
}

preview();
