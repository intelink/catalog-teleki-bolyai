// Catalog Teleki-Bolyai - frontend JS

const I18N = {
  ro: {
    page_title: "Catalog Biblioteca Teleki-Bolyai",
    brand_title: "Biblioteca Teleki-Bolyai",
    brand_sub: "Catalog electronic — cărți din sec. XVI",
    help: "Ghid utilizare",
    hero_title: "Catalogus Librorum Sedecimo Saeculo Impressorum",
    hero_sub:
      "Catalogul cărților din secolul al XVI-lea aflate în Biblioteca Teleki-Bolyai din Târgu-Mureș. Volumele I & II, ediția 2001.",
    stat_entries: "intrări",
    stat_authors: "autori",
    stat_places: "locuri de apariție",
    stat_years: "interval",
    lbl_query: "Căutare globală",
    ph_query: "autor, titlu, an, oraș, tipograf…",
    btn_search: "Caută",
    btn_reset: "Resetare",
    adv_title: "Căutare avansată",
    lbl_author: "Autor",
    lbl_title: "Titlu / lucrare",
    lbl_place: "Loc apariție",
    lbl_year_from: "An de la",
    lbl_year_to: "An până la",
    lbl_sort: "Sortare",
    sort_author: "autor (A→Z)",
    sort_year: "an (cresc.)",
    sort_year_desc: "an (descresc.)",
    sort_place: "loc apariție",
    sort_id: "cota catalog",
    qf_label: "Filtre rapide pe deceniu:",
    results_total: "rezultat(e)",
    no_results: "Niciun rezultat găsit. Încearcă alți termeni de căutare.",
    initial_prompt: "Introdu un termen de căutare sau alege un deceniu pentru a începe.",
    loading: "Se încarcă…",
    prev: "← Anterior",
    next: "Următor →",
    page: "Pag.",
    of: "din",
    anon: "(autor anonim)",
    entry_anon: "Lucrare anonimă",
    fld_shelfmark: "Cotă bibliotecă",
    fld_volume: "Volum",
    fld_page: "Pagină în PDF",
    fld_publication: "Publicare",
    fld_title: "Titlu",
    fld_description: "Descriere completă",
    fld_notes: "Note (ex libris, posesori etc.)",
    open_pdf: "Deschide PDF la pagina",
    footer_left:
      "Catalogus Librorum Sedecimo Saeculo Impressorum Bibliothecae Teleki-Bolyai, 2001.",
    footer_instr: "Instrucțiuni",
    no_author: "fără autor",
    asst_title: "🤖 Asistent catalog",
    asst_sub: "Pune o întrebare în limbaj natural. Asistentul extrage cuvinte-cheie multilingvistice, caută în catalog și răspunde cu o listă de cărți relevante (autor, titlu, cotă, an).",
    asst_provider: "Furnizor",
    asst_model: "Model",
    asst_placeholder: "ex: ce cărți sunt despre reforma protestantă? sau despre Erasmus? sau tipărite la Veneția?",
    asst_ask: "Întreabă",
    asst_thinking: "Asistentul gândește (caută în catalog și formulează răspunsul)…",
    asst_keywords: "Cuvinte-cheie extrase",
    asst_entries_used: "Intrări considerate",
    asst_no_entries: "Nicio intrare găsită cu aceste cuvinte-cheie.",
    asst_error: "Eroare",
    asst_examples_label: "Exemple:",
    asst_ex1: "Cărți despre reforma protestantă sau Luther",
    asst_ex2: "Lucrări de Erasmus din Rotterdam",
    asst_ex3: "Cărți tipărite la Veneția sau Basel",
    asst_ex4: "Tratate de medicină sau botanică",
  },
  hu: {
    page_title: "Teleki-Bolyai Könyvtár katalógusa",
    brand_title: "Teleki-Bolyai Könyvtár",
    brand_sub: "Elektronikus katalógus — XVI. századi könyvek",
    help: "Használati útmutató",
    hero_title: "Catalogus Librorum Sedecimo Saeculo Impressorum",
    hero_sub:
      "A marosvásárhelyi Teleki-Bolyai Könyvtár XVI. századi könyveinek katalógusa. I. és II. kötet, 2001. évi kiadás.",
    stat_entries: "tétel",
    stat_authors: "szerző",
    stat_places: "kiadási hely",
    stat_years: "időszak",
    lbl_query: "Általános keresés",
    ph_query: "szerző, cím, év, város, nyomdász…",
    btn_search: "Keresés",
    btn_reset: "Visszaállítás",
    adv_title: "Részletes keresés",
    lbl_author: "Szerző",
    lbl_title: "Cím / mű",
    lbl_place: "Kiadási hely",
    lbl_year_from: "Év -tól",
    lbl_year_to: "Év -ig",
    lbl_sort: "Rendezés",
    sort_author: "szerző (A→Z)",
    sort_year: "év (növ.)",
    sort_year_desc: "év (csökk.)",
    sort_place: "kiadási hely",
    sort_id: "katalógusszám",
    qf_label: "Gyors szűrés évtized szerint:",
    results_total: "találat",
    no_results: "Nincs találat. Próbáljon más keresési kifejezést.",
    initial_prompt: "Adjon meg egy keresési kifejezést vagy válasszon évtizedet.",
    loading: "Betöltés…",
    prev: "← Előző",
    next: "Következő →",
    page: "Oldal",
    of: "/",
    anon: "(névtelen szerző)",
    entry_anon: "Névtelen mű",
    fld_shelfmark: "Könyvtári jelzet",
    fld_volume: "Kötet",
    fld_page: "Oldal a PDF-ben",
    fld_publication: "Megjelenés",
    fld_title: "Cím",
    fld_description: "Teljes leírás",
    fld_notes: "Megjegyzések (ex libris, tulajdonosok stb.)",
    open_pdf: "PDF megnyitása a megfelelő oldalon",
    footer_left:
      "Catalogus Librorum Sedecimo Saeculo Impressorum Bibliothecae Teleki-Bolyai, 2001.",
    footer_instr: "Útmutató",
    no_author: "szerző nélkül",
    asst_title: "🤖 Katalógus-asszisztens",
    asst_sub: "Tegyen fel kérdést természetes nyelven. Az asszisztens többnyelvű kulcsszavakat keres, a katalógusban keres, és releváns könyvek listáját adja vissza (szerző, cím, jelzet, év).",
    asst_provider: "Szolgáltató",
    asst_model: "Modell",
    asst_placeholder: "pl. milyen könyvek szólnak a reformációról? vagy Erasmusról? vagy Velencében nyomtatva?",
    asst_ask: "Kérdez",
    asst_thinking: "Az asszisztens gondolkodik (keres a katalógusban és válaszol)…",
    asst_keywords: "Kivont kulcsszavak",
    asst_entries_used: "Figyelembe vett tételek",
    asst_no_entries: "Nincs találat ezekre a kulcsszavakra.",
    asst_error: "Hiba",
    asst_examples_label: "Példák:",
    asst_ex1: "Könyvek a reformációról vagy Lutherről",
    asst_ex2: "Rotterdami Erasmus művei",
    asst_ex3: "Velencében vagy Bázelben nyomtatott könyvek",
    asst_ex4: "Orvosi vagy botanikai értekezések",
  },
};

let LANG = localStorage.getItem("lang") || "ro";
let LAST_QUERY = {};
let FACETS = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ----- i18n -----

function applyLang() {
  document.documentElement.lang = LANG;
  document.title = I18N[LANG].page_title;
  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (I18N[LANG][key]) el.textContent = I18N[LANG][key];
  });
  $$("[data-i18n-attr]").forEach((el) => {
    const [attr, key] = el.dataset.i18nAttr.split(":");
    if (I18N[LANG][key]) el.setAttribute(attr, I18N[LANG][key]);
  });
  $$(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === LANG));
}

// ----- meta + stats -----

async function loadMeta() {
  const r = await fetch("/api/meta");
  const j = await r.json();
  const m = j.meta;
  $("#stats").innerHTML = `
    <div class="stat"><span class="num">${m.total_entries.toLocaleString()}</span><span data-i18n="stat_entries">${I18N[LANG].stat_entries}</span></div>
    <div class="stat"><span class="num">${m.distinct_authors.toLocaleString()}</span><span data-i18n="stat_authors">${I18N[LANG].stat_authors}</span></div>
    <div class="stat"><span class="num">${m.distinct_places.toLocaleString()}</span><span data-i18n="stat_places">${I18N[LANG].stat_places}</span></div>
    <div class="stat"><span class="num">${m.year_range[0]}–${m.year_range[1]}</span><span data-i18n="stat_years">${I18N[LANG].stat_years}</span></div>`;
}

async function loadFacets() {
  const r = await fetch("/api/facets");
  FACETS = await r.json();

  // populate datalists
  $("#authors-list").innerHTML = FACETS.authors
    .slice(0, 500)
    .map((a) => `<option value="${escAttr(a.name)}">`)
    .join("");
  $("#places-list").innerHTML = FACETS.places
    .slice(0, 200)
    .map((p) => `<option value="${escAttr(p.name)}">`)
    .join("");

  // decade chips
  const decades = {};
  FACETS.years.forEach((y) => {
    const d = Math.floor(y.year / 10) * 10;
    decades[d] = (decades[d] || 0) + y.count;
  });
  const dec = Object.keys(decades)
    .map(Number)
    .sort((a, b) => a - b);
  $("#decades").innerHTML = dec
    .map(
      (d) =>
        `<button type="button" class="decade-chip" data-decade="${d}">${d}s<span class="c">${decades[d]}</span></button>`
    )
    .join("");
  $$(".decade-chip").forEach((el) =>
    el.addEventListener("click", () => {
      $("#year_from").value = el.dataset.decade;
      $("#year_to").value = +el.dataset.decade + 9;
      doSearch();
    })
  );
}

// ----- search -----

function gatherQuery(extra = {}) {
  const f = $("#search-form");
  const fd = new FormData(f);
  const o = {};
  for (const [k, v] of fd.entries()) if (v) o[k] = v;
  return { ...o, ...extra };
}

async function doSearch(extra = {}) {
  const params = gatherQuery(extra);
  LAST_QUERY = params;

  // Allow empty search to show no results (rather than full dump)
  const hasAny =
    params.q || params.author || params.title || params.place || params.year_from || params.year_to;
  if (!hasAny) {
    $("#results-count").textContent = "";
    $("#results-list").innerHTML = `<div class="empty">${I18N[LANG].initial_prompt}</div>`;
    $("#results-pager-top").innerHTML = "";
    $("#results-pager-bottom").innerHTML = "";
    return;
  }

  $("#results-list").innerHTML = `<div class="loading">${I18N[LANG].loading}</div>`;

  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`/api/search?${qs}`);
  const j = await r.json();
  renderResults(j);
}

function renderResults(j) {
  const { results, total, offset, limit } = j;
  $("#results-count").innerHTML = `<strong>${total.toLocaleString()}</strong> ${I18N[LANG].results_total}`;

  if (total === 0) {
    $("#results-list").innerHTML = `<div class="empty">${I18N[LANG].no_results}</div>`;
    $("#results-pager-top").innerHTML = "";
    $("#results-pager-bottom").innerHTML = "";
    return;
  }

  // Build highlight terms from q + specific fields
  const terms = [];
  for (const k of ["q", "author", "title", "place"]) {
    if (LAST_QUERY[k]) {
      LAST_QUERY[k].split(/\s+/).forEach((t) => {
        const x = t.replace(/"/g, "").trim();
        if (x.length >= 2) terms.push(x);
      });
    }
  }

  $("#results-list").innerHTML = results.map((e) => renderEntryCard(e, terms)).join("");
  $$(".entry").forEach((el) =>
    el.addEventListener("click", () => openEntryModal(el.dataset.id))
  );

  const pager = renderPager(total, offset, limit);
  $("#results-pager-top").innerHTML = pager;
  $("#results-pager-bottom").innerHTML = pager;
  $$(".page-btn[data-offset]").forEach((b) =>
    b.addEventListener("click", () => {
      doSearch({ offset: b.dataset.offset });
      window.scrollTo({ top: $(".search-panel").offsetTop - 12, behavior: "smooth" });
    })
  );
}

function renderEntryCard(e, terms) {
  const author = e.author
    ? `<span class="entry-author">${hl(e.author, terms)}</span>`
    : `<span class="entry-author empty">${I18N[LANG].entry_anon}</span>`;
  const year = e.year ? `<span class="year">${e.year}</span>` : "";
  const place = e.place ? `<span class="place">${hl(e.place, terms)}</span>` : "";
  const printer = e.printer ? `, ${hl(e.printer, terms)}` : "";
  const pubLine = e.place || e.year
    ? `<div class="entry-pub">${place}${printer}${e.year && e.place ? `, ${e.year}` : ""}</div>`
    : "";
  return `
    <article class="entry" data-id="${escAttr(e.id)}">
      <div class="entry-head">
        ${author}
        <div class="entry-meta">
          ${year}
          <span class="id-tag">${escHtml(e.id)}</span>
          <span class="vol">${escHtml(e.volume || "")}</span>
        </div>
      </div>
      ${e.title ? `<div class="entry-title">${hl(e.title, terms)}</div>` : ""}
      ${pubLine}
      ${e.shelfmark ? `<div class="entry-shelf">${escHtml(e.shelfmark)}</div>` : ""}
    </article>`;
}

function renderPager(total, offset, limit) {
  if (total <= limit) return "";
  const pages = Math.ceil(total / limit);
  const cur = Math.floor(offset / limit);
  let out = "";
  if (cur > 0) {
    out += `<button class="page-btn" data-offset="${(cur - 1) * limit}">${I18N[LANG].prev}</button>`;
  } else {
    out += `<button class="page-btn" disabled>${I18N[LANG].prev}</button>`;
  }
  // page numbers (windowed)
  const start = Math.max(0, cur - 3);
  const end = Math.min(pages, cur + 4);
  if (start > 0) {
    out += `<button class="page-btn" data-offset="0">1</button>`;
    if (start > 1) out += `<span class="page-btn" style="border:none">…</span>`;
  }
  for (let p = start; p < end; p++) {
    out += `<button class="page-btn ${p === cur ? "current" : ""}" data-offset="${p * limit}">${p + 1}</button>`;
  }
  if (end < pages) {
    if (end < pages - 1) out += `<span class="page-btn" style="border:none">…</span>`;
    out += `<button class="page-btn" data-offset="${(pages - 1) * limit}">${pages}</button>`;
  }
  if (cur < pages - 1) {
    out += `<button class="page-btn" data-offset="${(cur + 1) * limit}">${I18N[LANG].next}</button>`;
  } else {
    out += `<button class="page-btn" disabled>${I18N[LANG].next}</button>`;
  }
  return out;
}

// ----- modal -----

async function openEntryModal(id) {
  const r = await fetch(`/api/entry/${encodeURIComponent(id)}`);
  const j = await r.json();
  const e = j.entry;
  if (!e) return;
  const pdfFile = e.volume && e.volume.indexOf("II") >= 0 ? "16_vol_II.pdf" : "16_vol_I_full.pdf";

  $("#modal-body").innerHTML = `
    <h2>${e.author ? escHtml(e.author) : I18N[LANG].entry_anon}</h2>
    <div class="modal-meta">
      <span class="id-tag" style="display:inline-block">${escHtml(e.id)}</span>
      ${e.year ? `<span><strong>${e.year}</strong></span>` : ""}
      ${e.place ? `<span>${escHtml(e.place)}</span>` : ""}
      <span><em>${escHtml(e.volume || "")}</em></span>
    </div>

    <dl>
      ${e.title ? `<dt>${I18N[LANG].fld_title}</dt><dd>${escHtml(e.title)}</dd>` : ""}
      ${e.place || e.printer || e.year
        ? `<dt>${I18N[LANG].fld_publication}</dt>
           <dd>${[e.place, e.printer, e.year].filter(Boolean).map(escHtml).join(", ")}</dd>`
        : ""}
      ${e.shelfmark ? `<dt>${I18N[LANG].fld_shelfmark}</dt><dd style="font-family:ui-monospace,Consolas,monospace">${escHtml(e.shelfmark)}</dd>` : ""}
      <dt>${I18N[LANG].fld_description}</dt>
      <dd>${escHtml(e.description || "")}</dd>
      ${e.notes
        ? `<dt>${I18N[LANG].fld_notes}</dt><dd class="notes">${escHtml(e.notes)}</dd>`
        : ""}
      <dt>${I18N[LANG].fld_page}</dt>
      <dd><a href="/${pdfFile}#page=${e.page}" target="_blank">${I18N[LANG].open_pdf} ${e.page}</a></dd>
    </dl>
  `;
  $("#entry-modal").classList.remove("hidden");
}

function closeModal() {
  $("#entry-modal").classList.add("hidden");
}

// ----- highlight -----

function hl(text, terms) {
  if (!text) return "";
  let h = escHtml(text);
  if (!terms || !terms.length) return h;
  // simple case-insensitive replace, ignoring accents
  const folded = fold(text);
  // For each term, find positions in folded text and wrap original
  for (const t of terms) {
    if (t.length < 2) continue;
    const ft = fold(t);
    const re = new RegExp(escRe(ft), "gi");
    // We can't directly use position-based wrap on escHtml output. Quick approach:
    // do a non-fold regex with diacritic-tolerant pattern
    const pattern = ft
      .split("")
      .map((c) => diacritMap[c] || escRe(c))
      .join("");
    try {
      h = h.replace(new RegExp(`(${pattern})`, "gi"), '<mark class="hl">$1</mark>');
    } catch {}
  }
  return h;
}

const diacritMap = {
  a: "[aàáâãäåāăąȁȃ]",
  e: "[eèéêëēĕėęě]",
  i: "[iìíîïĩīĭįı]",
  o: "[oòóôõöøōŏőǒ]",
  u: "[uùúûüũūŭůűųȕȗ]",
  s: "[sśŝşšș]",
  t: "[tţťțŧ]",
  c: "[cçćĉċč]",
  n: "[nñńņňŋ]",
  z: "[zźżžẑẓ]",
  l: "[lĺļľŀł]",
  r: "[rŕŗř]",
  d: "[dďđð]",
  g: "[gĝğġģǧ]",
  h: "[hĥħ]",
  y: "[yýÿŷ]",
  b: "[bḃ]",
  m: "[mḿṁ]",
};

function fold(s) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// ----- escapes -----

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escAttr(s) {
  return escHtml(s);
}
function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================== Assistant ============================== //

let ASST_PROVIDERS = [];
let ASST_BUSY = false;
const ASST_LS_KEY = "asst_pref_v1";

async function loadAssistantProviders() {
  try {
    const r = await fetch("/api/assistant/providers");
    const j = await r.json();
    ASST_PROVIDERS = j.providers || [];
  } catch (e) {
    ASST_PROVIDERS = [];
  }
  const provSel = $("#asst-provider");
  if (!provSel) return;
  provSel.innerHTML = ASST_PROVIDERS.map(
    (p) => `<option value="${escAttr(p.id)}">${escHtml(p.name)}</option>`
  ).join("");

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(ASST_LS_KEY) || "{}"); } catch {}
  if (saved.provider && ASST_PROVIDERS.find((p) => p.id === saved.provider)) {
    provSel.value = saved.provider;
  }
  populateModelSelect(saved.model);
  provSel.addEventListener("change", () => populateModelSelect());
  $("#asst-model").addEventListener("change", saveAsstPref);
}

function populateModelSelect(preferredModel) {
  const provId = $("#asst-provider").value;
  const prov = ASST_PROVIDERS.find((p) => p.id === provId);
  const sel = $("#asst-model");
  if (!prov) {
    sel.innerHTML = "";
    return;
  }
  sel.innerHTML = prov.models
    .map((m) => `<option value="${escAttr(m.name)}">${escHtml(m.label || m.name)}</option>`)
    .join("");
  if (preferredModel && prov.models.find((m) => m.name === preferredModel)) {
    sel.value = preferredModel;
  }
  saveAsstPref();
}

function saveAsstPref() {
  localStorage.setItem(
    ASST_LS_KEY,
    JSON.stringify({
      provider: $("#asst-provider").value,
      model: $("#asst-model").value,
    })
  );
}

function renderExamples() {
  const ex = $("#asst-examples");
  if (!ex) return;
  const items = [
    I18N[LANG].asst_ex1,
    I18N[LANG].asst_ex2,
    I18N[LANG].asst_ex3,
    I18N[LANG].asst_ex4,
  ];
  ex.innerHTML =
    `<span class="qf-label">${I18N[LANG].asst_examples_label}</span>` +
    items
      .map((t) => `<button type="button" class="asst-ex-chip">${escHtml(t)}</button>`)
      .join("");
  $$(".asst-ex-chip").forEach((b) =>
    b.addEventListener("click", () => {
      $("#asst-question").value = b.textContent;
      $("#asst-question").focus();
    })
  );
}

function renderAssistantAnswer(text) {
  const escaped = escHtml(text);
  const linked = escaped.replace(/\[([A-Z]\s\d+)\]/g, (m, id) => {
    return `<a href="#" class="asst-cite" data-id="${escAttr(id)}">[${escHtml(id)}]</a>`;
  });
  const md = linked
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
  return md;
}

async function askAssistant(ev) {
  ev.preventDefault();
  if (ASST_BUSY) return;
  const question = $("#asst-question").value.trim();
  if (!question) return;
  const provider = $("#asst-provider").value;
  const model = $("#asst-model").value;
  if (!provider || !model) return;

  ASST_BUSY = true;
  $("#asst-submit").disabled = true;
  $("#asst-response").innerHTML = `<div class="asst-loading">${I18N[LANG].asst_thinking}</div>`;

  try {
    const r = await fetch("/api/assistant/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, provider, model }),
    });
    const j = await r.json();
    if (j.error) {
      $("#asst-response").innerHTML =
        `<div class="asst-error"><strong>${I18N[LANG].asst_error}:</strong> ${escHtml(j.error)}</div>`;
      return;
    }
    const kw = (j.keywords || []).map(
      (k) => `<span class="asst-kw">${escHtml(k)}</span>`
    ).join(" ");
    const t = j.timing || {};
    const meta = `<div class="asst-meta">
      <span>${escHtml(provider)} / ${escHtml(model)}</span>
      <span>expand ${t.expand_s||0}s</span>
      <span>retrieve ${t.retrieve_s||0}s</span>
      <span>answer ${t.answer_s||0}s</span>
      <span>${(j.entries||[]).length} ${I18N[LANG].asst_entries_used.toLowerCase()}</span>
    </div>`;
    const body = `<div class="asst-answer">${renderAssistantAnswer(j.answer || "")}</div>`;
    const kwBlock = kw
      ? `<div class="asst-keywords"><span class="qf-label">${I18N[LANG].asst_keywords}:</span> ${kw}</div>`
      : "";
    $("#asst-response").innerHTML = meta + body + kwBlock;
    $$(".asst-cite").forEach((a) =>
      a.addEventListener("click", (ev2) => {
        ev2.preventDefault();
        openEntryModal(a.dataset.id);
      })
    );
  } catch (e) {
    $("#asst-response").innerHTML =
      `<div class="asst-error"><strong>${I18N[LANG].asst_error}:</strong> ${escHtml(e.message || String(e))}</div>`;
  } finally {
    ASST_BUSY = false;
    $("#asst-submit").disabled = false;
  }
}

// ----- init -----

window.addEventListener("DOMContentLoaded", async () => {
  applyLang();
  await loadMeta();
  await loadFacets();
  await loadAssistantProviders();
  renderExamples();

  $$(".lang-btn").forEach((b) =>
    b.addEventListener("click", () => {
      LANG = b.dataset.lang;
      localStorage.setItem("lang", LANG);
      applyLang();
      // re-render stats with translated labels
      loadMeta();
      renderExamples();
      // re-render results count text if visible
      if (Object.keys(LAST_QUERY).length) doSearch();
    })
  );

  $("#search-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    doSearch({ offset: 0 });
  });

  // live-search debounce on global query
  let timer = null;
  $("#q").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => doSearch({ offset: 0 }), 280);
  });

  $("#btn-reset").addEventListener("click", () => {
    $("#search-form").reset();
    LAST_QUERY = {};
    $("#results-count").textContent = "";
    $("#results-list").innerHTML = `<div class="empty">${I18N[LANG].initial_prompt}</div>`;
    $("#results-pager-top").innerHTML = "";
    $("#results-pager-bottom").innerHTML = "";
  });

  // modal close handlers
  $("#modal-close").addEventListener("click", closeModal);
  $(".modal-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeModal();
  });

  // assistant
  $("#asst-form").addEventListener("submit", askAssistant);
  $("#asst-question").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
      askAssistant(ev);
    }
  });

  // initial empty state
  $("#results-list").innerHTML = `<div class="empty">${I18N[LANG].initial_prompt}</div>`;
});
