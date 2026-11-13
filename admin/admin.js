// Overview of every archive site (locked with the GitHub key, see js/gate.js). Reads manifest.json (written by
// scripts/build.py from features.json and each site's site.json) and commits features.json to the private repo with
// the key; the commit starts the publish workflow, which rebuilds every site with its features.
import { putJson } from "../js/gate.js";
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

let M, template, over, saved;

function toast(msg, ms = 4000) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), ms); }
function modal(html, bind) {
  const m = $("#modal"); $(".modal-card", m).innerHTML = html; m.hidden = false;
  m.onclick = (e) => { if (e.target === m || e.target.closest("[data-close]")) m.hidden = true; };
  bind && bind($(".modal-card", m));
}

const def = (k) => M.defs.find((d) => d.key === k);
const fallback = (d) => (d.kind === "select" ? d.options[0][0] : true);
const tplVal = (k) => (k in template ? template[k] : fallback(def(k)));
const val = (site, k) => (over[site] && k in over[site] ? over[site][k] : tplVal(k));
const isOver = (site, k) => !!(over[site] && k in over[site]);
const state = () => JSON.stringify({ template, sites: over });

// a value that the site can't use, given its other settings
function blocked(s, k) {
  if (s.na[k]) return s.na[k];
  if (k === "sitePhoto" && !s.na.map && val(s.key, "map") === "off") return "map is off";
  return "";
}
function note(s, k) {
  if (k === "map" && val(s.key, "map") === "tab" && (s.na.boxes || !val(s.key, "boxes"))) return "find areas is off, so the map gets its own view";
  return "";
}

function control(d, v, attrs) {
  if (d.kind === "select") return `<select ${attrs}>${d.options.map(([o, l]) => `<option value="${esc(o)}" ${o === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  return `<label class="sw"><input type="checkbox" ${attrs} ${v ? "checked" : ""}><span></span></label><span class="sw-txt">${v ? "On" : "Off"}</span>`;
}

function render() {
  const sites = M.list;
  const groups = [...new Set(M.defs.map((d) => d.group))];
  let h = `<colgroup><col class="feat"><col>${sites.map(() => "<col>").join("")}</colgroup>
    <thead><tr><th>Feature</th><th class="tpl">Defaults<small class="feat-help">for new archives</small></th>${sites.map((s) => `<th><div class="sitehead"><span class="mk" style="background:${esc(s.accent)}">${esc(s.mark)}</span><div>${esc(s.title)}<small>${s.count != null ? `${Number(s.count).toLocaleString()} ${esc(s.noun)}` : ""}${s.hub ? " · combined" : ""}</small>${s.url ? `<span class="sitelinks"><a href="${esc(s.url)}" target="_blank" rel="noopener">Site ↗</a>${s.na.editor ? "" : ` · <a href="${esc(s.url)}editor.html" target="_blank" rel="noopener">Editor ↗</a>`}</span>` : ""}</div></div></th>`).join("")}</tr></thead><tbody>`;
  const std = { gallery: "Gallery", table: "Table", map: "Map", charts: "Charts" };
  const menu = (s) => s.views.map((v) => { const n = s.names[v] || (v === "boxes" ? s.group : std[v]); return `<span class="${s.names[v] ? "renamed" : ""}">${esc(n)}</span>`; }).join("");
  h += `<tr class="grp"><td colspan="${sites.length + 2}">Menu as visitors see it</td></tr>
    <tr><td><span class="feat-label">Views and their names</span><span class="feat-help">Rename in each site’s editor: Tools → Names of views.</span></td><td class="tpl"><span class="na">set per site</span></td>
    ${sites.map((s) => `<td><div class="menu-chips">${menu(s)}</div></td>`).join("")}</tr>`;
  for (const g of groups) {
    h += `<tr class="grp"><td colspan="${sites.length + 2}">${esc(g)}</td></tr>`;
    for (const d of M.defs.filter((x) => x.group === g)) {
      h += `<tr><td><span class="feat-label">${esc(d.label)}</span><span class="feat-help">${esc(d.help)}</span></td>
        <td class="tpl"><div class="cell">${control(d, tplVal(d.key), `data-t="${d.key}"`)}</div></td>`;
      for (const s of sites) {
        const b = blocked(s, d.key);
        if (b) { h += `<td><span class="na">n/a · ${esc(b)}</span></td>`; continue; }
        const o = isOver(s.key, d.key), n = note(s, d.key);
        h += `<td><div class="cell ${o ? "ov" : "inh"}" title="${o ? "Set for this site" : "Same as the defaults"}">${control(d, val(s.key, d.key), `data-s="${s.key}" data-k="${d.key}"`)}${o ? `<span class="ovdot" title="Differs from the defaults"></span><button class="reset" data-reset="${s.key}" data-k="${d.key}" title="Back to the default">↺</button>` : ""}</div>${n ? `<span class="note">${esc(n)}</span>` : ""}</td>`;
      }
      h += "</tr>";
    }
  }
  $("#grid").innerHTML = h + "</tbody>";
  const changed = state() !== saved;
  $("#dirty").textContent = changed ? "Unsaved changes" : "All saved";
  renderAssets();
}

function renderAssets() {
  const A = M.assets || {};
  const photoSites = M.list.filter((s) => !blocked(s, "sitePhoto") && val(s.key, "sitePhoto")).map((s) => s.title);
  $("#assets").innerHTML = `${A.photo ? `<img src="${esc(A.photo.url)}" alt="Site photo">` : `<div class="na">No site photo yet</div>`}
    <div><h3>Shared map assets</h3>
      <p>${A.areas || 0} area labels · ${A.places || 0} placed on the map. Pins and the photo’s position are set in an archive’s editor (Tools → Area pins on the map).</p>
      <p>${A.photo ? `Site photo: shown on ${photoSites.length ? esc(photoSites.join(", ")) : "no site yet"}.` : "Add sites/isthmia/site-photo.jpg (scripts/site_photo.py) to offer a site photo."}</p>
      <div class="chips">${(A.areaNames || []).map((n) => `<span class="${(A.placed || []).includes(n) ? "on" : ""}">${esc(n)}</span>`).join("")}</div>
      <p class="small muted" style="margin-top:8px">Highlighted labels have a pin.</p></div>`;
}

function set(site, k, v) {
  if (site == null) { template[k] = v; }
  else {
    over[site] ||= {};
    if (v === tplVal(k)) delete over[site][k]; else over[site][k] = v;
  }
  render();
}

function out() {
  const sites = {};
  for (const s of M.list) sites[s.key] = over[s.key] || {};
  for (const k of Object.keys(over)) if (!(k in sites)) sites[k] = over[k];
  return { template, sites };
}
function download() {
  const blob = new Blob([JSON.stringify(out(), null, 1) + "\n"], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "features.json" });
  document.body.appendChild(a); a.click(); a.remove();
}

async function save() {
  $("#saveBtn").disabled = true;
  try {
    await putJson("features.json", out(), "Site features (overview page)");
    saved = state(); render();
    toast("Saved. Every site republishes with its features in a minute or two.", 6000);
  } catch (e) { toast("Could not save: " + e.message, 7000); }
  $("#saveBtn").disabled = false;
}

async function init() {
  M = await (await fetch("manifest.json", { cache: "no-cache" })).json();
  const hub = M.list.find((s) => s.hub), th = (hub && hub.theme) || {}, root = document.documentElement.style;
  if (th.accent) root.setProperty("--accent", th.accent);
  if (th.accentInk) root.setProperty("--accent-ink", th.accentInk);
  if (th.accentSoft) root.setProperty("--accent-soft", th.accentSoft);
  template = { ...M.template }; over = JSON.parse(JSON.stringify(M.sites || {}));
  saved = state();
  $("#grid").addEventListener("change", (e) => {
    const t = e.target, d = def(t.dataset.t || t.dataset.k); if (!d) return;
    const v = d.kind === "select" ? t.value : t.checked;
    set(t.dataset.t ? null : t.dataset.s, d.key, v);
  });
  $("#grid").addEventListener("click", (e) => { const r = e.target.closest("[data-reset]"); if (r) { delete over[r.dataset.reset][r.dataset.k]; render(); } });
  $("#dlBtn").onclick = download;
  $("#saveBtn").onclick = save;
  addEventListener("beforeunload", (e) => { if (state() !== saved) { e.preventDefault(); e.returnValue = ""; } });
  render();
}
init().catch((e) => { $("#grid").innerHTML = `<tr><td class="na">Couldn’t load the settings: ${esc(e.message)}</td></tr>`; });
