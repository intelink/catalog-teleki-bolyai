# -*- coding: utf-8 -*-
"""
Asistent RAG pentru catalogul Teleki-Bolyai sec. XVII.

Flow in 2 pasi:
  1. Query expansion - LLM extrage cuvinte-cheie multilingvistice (latina,
     maghiara, germana, italiana, romana) din intrebarea utilizatorului.
  2. Retrieve & answer - cautare keyword in catalog, top-K intrari trimise
     ca context la LLM care formuleaza raspunsul cu citatii (id, autor,
     titlu, cota, an).

Trei furnizori LLM:
  - Claude CLI (`claude --print --model <opus|sonnet|haiku>`)
  - Codex CLI (`codex exec`)
  - Ollama HTTP (`http://localhost:11434/api/chat`)
"""

import json
import os
import re
import subprocess
import time
import urllib.request
import urllib.error

OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://localhost:11434")
LLM_TIMEOUT = int(os.environ.get("ASSISTANT_TIMEOUT", "120"))

# Modele Ollama excluse din selector (embedding / specializate)
OLLAMA_BLACKLIST_PREFIXES = (
    "nomic-embed",
    "mxbai-embed",
    "all-minilm",
    "translategemma",
)


# ---------------------------- Providers ---------------------------- #

class ProviderError(RuntimeError):
    pass


def call_claude(prompt, model="sonnet"):
    """Cheama claude CLI in mod print. model in {opus, sonnet, haiku}."""
    args = ["claude", "--print", "--model", model]
    try:
        r = subprocess.run(
            args,
            input=prompt,
            capture_output=True,
            text=True,
            timeout=LLM_TIMEOUT,
        )
    except subprocess.TimeoutExpired:
        raise ProviderError(f"claude timeout dupa {LLM_TIMEOUT}s")
    except FileNotFoundError:
        raise ProviderError("claude CLI nu este instalat")
    if r.returncode != 0:
        raise ProviderError(f"claude exit={r.returncode}: {r.stderr.strip()[:400]}")
    return r.stdout.strip()


def call_codex(prompt, model=None):
    """Cheama codex CLI in mod exec."""
    args = ["codex", "exec", "--skip-git-repo-check", "--color", "never", "--cd", "/tmp"]
    if model:
        args += ["-c", f'model="{model}"']
    args.append(prompt)
    try:
        r = subprocess.run(
            args,
            capture_output=True,
            text=True,
            timeout=LLM_TIMEOUT,
        )
    except subprocess.TimeoutExpired:
        raise ProviderError(f"codex timeout dupa {LLM_TIMEOUT}s")
    except FileNotFoundError:
        raise ProviderError("codex CLI nu este instalat")
    if r.returncode != 0:
        msg = r.stderr.strip()[:400] or r.stdout.strip()[-400:]
        raise ProviderError(f"codex exit={r.returncode}: {msg}")
    # Codex exec amesteca metadata cu raspunsul; pastreaza linii non-meta
    out = r.stdout
    # Sectiunea raspunsului apare dupa o linie cu doar "---" sau dupa "codex"
    # Pastram tot output-ul curatat de header
    lines = out.splitlines()
    keep = []
    in_payload = False
    for ln in lines:
        if not in_payload:
            if ln.strip() == "--------" or ln.strip().startswith("codex"):
                in_payload = True
                continue
            continue
        # skip metadata lines
        if ln.startswith("tokens used") or ln.startswith("reasoning") or ln.startswith("session"):
            continue
        keep.append(ln)
    text = "\n".join(keep).strip()
    return text or out.strip()


def call_ollama(prompt, model):
    """POST la /api/chat (non-streaming)."""
    body = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        f"{OLLAMA_BASE}/api/chat",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=LLM_TIMEOUT) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        raise ProviderError(f"ollama unreachable: {e}")
    except (TimeoutError, OSError) as e:
        raise ProviderError(f"ollama error: {e}")
    msg = payload.get("message", {}).get("content", "").strip()
    if not msg:
        raise ProviderError("ollama response empty")
    return msg


def list_ollama_models():
    try:
        with urllib.request.urlopen(f"{OLLAMA_BASE}/api/tags", timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return []
    out = []
    for m in data.get("models", []):
        name = m.get("name") or m.get("model")
        if not name:
            continue
        if any(name.startswith(p) for p in OLLAMA_BLACKLIST_PREFIXES):
            continue
        out.append({
            "name": name,
            "is_cloud": bool(":cloud" in name or m.get("remote_host")),
        })
    # Sort: local first, then cloud, alphabetical within
    out.sort(key=lambda x: (x["is_cloud"], x["name"]))
    return out


def list_providers():
    """Returneaza arborele provider/modele disponibile."""
    providers = []

    # Claude
    try:
        r = subprocess.run(["claude", "--version"], capture_output=True, text=True, timeout=5)
        if r.returncode == 0:
            providers.append({
                "id": "claude",
                "name": "Claude (Anthropic CLI)",
                "available": True,
                "models": [
                    {"name": "opus", "label": "claude opus (cel mai capabil)"},
                    {"name": "sonnet", "label": "claude sonnet (recomandat)"},
                    {"name": "haiku", "label": "claude haiku (cel mai rapid)"},
                ],
            })
    except Exception:
        pass

    # Codex
    try:
        r = subprocess.run(["codex", "--version"], capture_output=True, text=True, timeout=5)
        if r.returncode == 0:
            providers.append({
                "id": "codex",
                "name": "Codex (OpenAI CLI)",
                "available": True,
                "models": [
                    {"name": "default", "label": "codex (model implicit din ~/.codex/config.toml)"},
                ],
            })
    except Exception:
        pass

    # Ollama
    om = list_ollama_models()
    if om:
        providers.append({
            "id": "ollama",
            "name": "Ollama local",
            "available": True,
            "models": [
                {"name": m["name"], "label": m["name"] + (" (cloud)" if m["is_cloud"] else " (local)")}
                for m in om
            ],
        })
    return providers


def call_provider(provider, model, prompt):
    if provider == "claude":
        return call_claude(prompt, model or "sonnet")
    if provider == "codex":
        return call_codex(prompt, None if model == "default" else model)
    if provider == "ollama":
        if not model:
            raise ProviderError("model lipseste pentru ollama")
        return call_ollama(prompt, model)
    raise ProviderError(f"provider necunoscut: {provider}")


# ---------------------------- RAG ---------------------------- #

EXPAND_SYSTEM = (
    "Esti un asistent pentru un catalog electronic de carti tiparite in "
    "secolul al XVI-lea, aflate in Biblioteca Teleki-Bolyai din Targu-Mures. "
    "Cartile sunt in limba latina, maghiara, germana, italiana, franceza. "
    "Catalogul contine campurile: autor, titlu, loc de aparitie, tipograf, an, "
    "cota bibliotecara, descriere bibliografica, note (ex libris, posesori, "
    "marginalia).\n\n"
    "Sarcina ta este sa extragi din intrebarea utilizatorului 5-15 cuvinte-cheie "
    "in mai multe limbi (latina mai ales, dar si maghiara, germana, italiana, "
    "engleza, romana) care s-ar gasi probabil in titlurile sau descrierile "
    "cartilor relevante. NU traduci intrebarea — extragi termeni de cautare. "
    "Foloseste forme latinizate ale numelor de locuri si concepte (ex: "
    "'romanorum', 'valachia', 'moldaviae', 'transylvania', 'pannoniae', 'daciae', "
    "'historia', 'chronicon'). Include si variante flexate (singular/plural, "
    "nominativ/genitiv) cand are sens. Returneaza DOAR lista cuvintelor "
    "separate prin virgula, fara explicatii, fara titluri, fara propozitii."
)


def expand_query(question, provider, model):
    prompt = (
        EXPAND_SYSTEM
        + "\n\nIntrebare utilizator: "
        + question.strip()
        + "\n\nLista cuvintelor cheie (separate prin virgula):"
    )
    raw = call_provider(provider, model, prompt)
    # Curata: doar prima linie cu virgule sau toata lista pe linii separate
    raw = raw.strip()
    # Extrage cuvinte
    # Acceptam virgula, punct si virgula, newline
    parts = re.split(r"[,;\n]+", raw)
    out = []
    for p in parts:
        p = p.strip().strip(".").strip("•-*").strip()
        # elimina prefixe gen "1.", "- ", numere
        p = re.sub(r"^\d+[\.\)]\s*", "", p)
        p = p.strip()
        if not p:
            continue
        # ignora propozitii lungi
        if len(p) > 50 or len(p.split()) > 5:
            continue
        if p.lower() in ("aici sunt", "iata", "raspuns", "cuvinte cheie"):
            continue
        out.append(p)
    # Daca LLM a refuzat sau output gol, fallback: cuvinte din intrebare
    if not out:
        out = [w for w in re.findall(r"\w{4,}", question) if w.lower() not in
               ("care", "carti", "despre", "cele", "ceva", "sunt", "exista")]
    # Dedup
    seen = set()
    uniq = []
    for w in out:
        k = w.lower()
        if k in seen:
            continue
        seen.add(k)
        uniq.append(w)
    return uniq[:20]


def fold_search(text):
    import unicodedata
    if not text:
        return ""
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower()


def retrieve(keywords, entries, top_k=40):
    """Scoreaza intrari prin numar de keywords gasite in _search_blob."""
    if not keywords:
        return []
    folded_kw = [fold_search(k) for k in keywords]
    folded_kw = [k for k in folded_kw if len(k) >= 3]

    scored = []
    for e in entries:
        blob = e.get("_search_blob") or fold_search(
            " ".join(str(e.get(f, "")) for f in
                     ("author", "title", "place", "printer", "description", "notes"))
        )
        hits = 0
        matched_kw = []
        for kw in folded_kw:
            if kw in blob:
                hits += 1
                matched_kw.append(kw)
        if hits > 0:
            scored.append((hits, e, matched_kw))
    scored.sort(key=lambda x: (-x[0], -(x[1].get("year") or 0)))
    return [(s[1], s[2]) for s in scored[:top_k]]


def format_entries_for_prompt(entries):
    """Formateaza intrarile pentru promptul de raspuns."""
    parts = []
    for e in entries:
        item = {
            "id": e.get("id"),
            "autor": e.get("author") or "(anonim)",
            "titlu": e.get("title") or "",
            "an": e.get("year"),
            "loc": e.get("place") or "",
            "tipograf": e.get("printer") or "",
            "cota": e.get("shelfmark") or "",
        }
        line = (
            f"[{item['id']}] {item['autor']} — {item['titlu']} "
            f"({item['loc']}, {item['tipograf']}, {item['an']}) "
            f"COTA: {item['cota']}"
        )
        parts.append(line)
    return "\n".join(parts)


ANSWER_SYSTEM = (
    "Esti un asistent bibliografic pentru un catalog de carti tiparite in "
    "secolul al XVI-lea (Biblioteca Teleki-Bolyai, Targu-Mures). Utilizatorul "
    "iti pune o intrebare iar tu primesti deja o lista de intrari potential "
    "relevante, gasite prin cautare keyword in catalog. \n\n"
    "Sarcina:\n"
    "1) Identifica din lista cele care raspund cu adevarat intrebarii. Multe "
    "vor fi false positive de la keyword match — filtreaza-le.\n"
    "2) Raspunde concis in limba intrebarii (romana implicit) listand cartile "
    "relevante intr-un format clar:\n"
    "   - **[ID]** Autor — *Titlu* (loc, an) — cota: XXX\n"
    "3) Daca lista nu contine raspuns la intrebare, spune direct si sugereaza "
    "termeni de cautare mai potriviti.\n"
    "4) Nu inventa autori, titluri sau cote care nu sunt in lista. ID-urile "
    "din paranteze patrate (ex: [A 12], [H 453]) sunt cotele de catalog si "
    "trebuie pastrate fara modificare — utilizatorul poate da click pe ele.\n"
    "5) Nu repeta intregul context — doar concluziile."
)


def build_answer_prompt(question, scored_entries):
    entries_block = format_entries_for_prompt([e for e, _ in scored_entries])
    return (
        ANSWER_SYSTEM
        + "\n\nIntrebarea utilizatorului:\n"
        + question.strip()
        + "\n\nIntrari gasite in catalog ("
        + str(len(scored_entries))
        + " candidati, in ordinea relevantei):\n"
        + entries_block
        + "\n\nRaspuns:"
    )


def ask(question, provider, model, all_entries, top_k=40):
    """Pipeline complet: expand -> retrieve -> answer."""
    t0 = time.time()
    keywords = expand_query(question, provider, model)
    t1 = time.time()
    scored = retrieve(keywords, all_entries, top_k=top_k)
    t2 = time.time()
    if not scored:
        answer = (
            "Nu am gasit intrari in catalog care sa contina cuvintele-cheie "
            f"extrase: {', '.join(keywords)}. Incearca cu alti termeni "
            "(de exemplu in latina sau maghiara)."
        )
        timing = {"expand_s": round(t1-t0, 2), "retrieve_s": round(t2-t1, 2), "answer_s": 0.0}
        return {"answer": answer, "keywords": keywords, "entries": [], "timing": timing}

    answer_prompt = build_answer_prompt(question, scored)
    answer_text = call_provider(provider, model, answer_prompt)
    t3 = time.time()

    used = []
    for e, matched in scored:
        used.append({
            "id": e.get("id"),
            "author": e.get("author"),
            "title": e.get("title"),
            "year": e.get("year"),
            "place": e.get("place"),
            "shelfmark": e.get("shelfmark"),
            "matched": matched,
        })

    return {
        "answer": answer_text,
        "keywords": keywords,
        "entries": used,
        "timing": {
            "expand_s": round(t1-t0, 2),
            "retrieve_s": round(t2-t1, 3),
            "answer_s": round(t3-t2, 2),
        },
    }
