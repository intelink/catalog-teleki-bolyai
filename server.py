# -*- coding: utf-8 -*-
"""
Catalog electronic de cautare – Biblioteca Teleki-Bolyai.
Server HTTP simplu (doar stdlib Python) pe portul 12345.

Endpoints:
  GET /                  -> index.html
  GET /styles.css        -> CSS
  GET /app.js            -> JS frontend
  GET /api/meta          -> meta info (totaluri, intervale)
  GET /api/search        -> cautare (q, author, title, year, year_to, place)
  GET /api/entry/<id>    -> detalii o intrare
  GET /api/facets        -> lista distincta autori, locuri, ani
  GET /<file.pdf>        -> servire PDF-uri sursa
  GET /INSTR_UTIL_17.pdf -> instructiuni utilizare
"""

import http.server
import socketserver
import json
import os
import sys
import re
import unicodedata
import urllib.parse
from functools import lru_cache

PORT = 8970
HERE = os.path.dirname(os.path.abspath(__file__))
CATALOG_PATH = os.path.join(HERE, "catalog.json")

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# ------------------------- Load catalog ------------------------- #

print(f"[+] Loading catalog from {CATALOG_PATH} ...")
with open(CATALOG_PATH, encoding="utf-8") as f:
    CATALOG = json.load(f)

ENTRIES = CATALOG["entries"]
INCLUSIONS = CATALOG.get("inclusions", [])
META = CATALOG["meta"]
print(f"[+] {len(ENTRIES):,} entries, {len(INCLUSIONS):,} inclusions loaded")


def fold(s):
    """Lowercase + remove diacritics for accent-insensitive search."""
    if not s:
        return ""
    nfkd = unicodedata.normalize("NFKD", s)
    no_diac = "".join(c for c in nfkd if not unicodedata.combining(c))
    return no_diac.lower()


# Pre-build searchable representations for each entry once at startup.
for e in ENTRIES:
    e["_search_blob"] = fold(
        " ".join(
            str(x) for x in (
                e.get("id", ""),
                e.get("shelfmark", ""),
                e.get("author", ""),
                e.get("title", ""),
                e.get("place", ""),
                e.get("printer", ""),
                e.get("description", ""),
                e.get("notes", ""),
            ) if x
        )
    )
    e["_author_fold"] = fold(e.get("author", ""))
    e["_title_fold"] = fold(e.get("title", ""))
    e["_place_fold"] = fold(e.get("place", ""))

print("[+] Indexes built")


# ------------------------- Search ------------------------- #

def parse_query_terms(s):
    """Split a query into terms; quoted phrases preserved."""
    if not s:
        return []
    # very simple tokenizer
    s = s.strip()
    terms = re.findall(r'"([^"]+)"|(\S+)', s)
    return [fold(a or b) for a, b in terms if (a or b)]


def search(params):
    q = params.get("q", "").strip()
    author = params.get("author", "").strip()
    title = params.get("title", "").strip()
    place = params.get("place", "").strip()
    try:
        year_from = int(params.get("year_from", "") or 0)
    except ValueError:
        year_from = 0
    try:
        year_to = int(params.get("year_to", "") or 0)
    except ValueError:
        year_to = 0
    sort = params.get("sort", "author")
    offset = max(0, int(params.get("offset", "0") or 0))
    limit = max(1, min(200, int(params.get("limit", "50") or 50)))

    q_terms = parse_query_terms(q)
    author_terms = parse_query_terms(author)
    title_terms = parse_query_terms(title)
    place_terms = parse_query_terms(place)

    results = []
    for e in ENTRIES:
        if q_terms and not all(t in e["_search_blob"] for t in q_terms):
            continue
        if author_terms and not all(t in e["_author_fold"] for t in author_terms):
            continue
        if title_terms and not all(t in e["_title_fold"] for t in title_terms):
            continue
        if place_terms and not all(t in e["_place_fold"] for t in place_terms):
            continue
        if year_from and (not e.get("year") or e["year"] < year_from):
            continue
        if year_to and (not e.get("year") or e["year"] > year_to):
            continue
        results.append(e)

    # Sort
    if sort == "year":
        results.sort(key=lambda r: (r.get("year") or 9999, r.get("author") or "", r.get("title") or ""))
    elif sort == "year_desc":
        results.sort(key=lambda r: (-(r.get("year") or 0), r.get("author") or "", r.get("title") or ""))
    elif sort == "place":
        results.sort(key=lambda r: (r.get("place") or "ZZZ", r.get("year") or 9999))
    elif sort == "id":
        results.sort(key=lambda r: natural_key(r.get("id") or ""))
    else:  # author
        results.sort(key=lambda r: (r.get("author") or "ZZZ", r.get("year") or 9999))

    total = len(results)
    page = results[offset:offset + limit]
    # Strip search blobs for the response
    out_page = [{k: v for k, v in e.items() if not k.startswith("_")} for e in page]
    return {"total": total, "offset": offset, "limit": limit, "results": out_page}


def natural_key(s):
    parts = re.split(r"(\d+)", s)
    return [int(p) if p.isdigit() else p for p in parts]


# ------------------------- Facets ------------------------- #

@lru_cache(maxsize=1)
def facets():
    from collections import Counter
    authors = Counter(e["author"] for e in ENTRIES if e["author"])
    places = Counter(e["place"] for e in ENTRIES if e["place"])
    years = Counter(e["year"] for e in ENTRIES if e["year"])
    return {
        "authors": [{"name": a, "count": c} for a, c in authors.most_common()],
        "places": [{"name": p, "count": c} for p, c in places.most_common()],
        "years": sorted(
            ({"year": y, "count": c} for y, c in years.items()),
            key=lambda x: x["year"],
        ),
        "year_min": min(years) if years else None,
        "year_max": max(years) if years else None,
    }


# ------------------------- HTTP handler ------------------------- #

class Handler(http.server.SimpleHTTPRequestHandler):
    # Override to serve from HERE always
    def translate_path(self, path):
        path = path.split("?", 1)[0].split("#", 1)[0]
        path = urllib.parse.unquote(path)
        # Strip leading slash
        rel = path.lstrip("/").lstrip("\\")
        if not rel:
            rel = "index.html"
        return os.path.join(HERE, rel)

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/meta":
            self._send_json({"meta": META})
            return
        if path == "/api/facets":
            self._send_json(facets())
            return
        if path == "/api/search":
            params = {k: v[0] for k, v in urllib.parse.parse_qs(parsed.query, keep_blank_values=True).items()}
            self._send_json(search(params))
            return
        if path.startswith("/api/entry/"):
            eid = urllib.parse.unquote(path[len("/api/entry/"):])
            for e in ENTRIES:
                if e["id"] == eid:
                    out = {k: v for k, v in e.items() if not k.startswith("_")}
                    self._send_json({"entry": out})
                    return
            self._send_json({"error": "not found"}, status=404)
            return

        # Static files
        return super().do_GET()

    def end_headers(self):
        # Allow CORS for any potential ajax from file://
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


def main():
    handler = Handler
    # Allow address reuse to avoid "port already in use" on quick restarts
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}/"
        print()
        print(f"  Catalog Teleki-Bolyai - server pornit")
        print(f"  Adresa: {url}")
        print(f"  Foloseste Ctrl+C pentru oprire.")
        print()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[!] Oprire server.")


if __name__ == "__main__":
    main()
