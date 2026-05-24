# 📕 Catalog Teleki-Bolyai — Catalogus Librorum Sedecimo Saeculo Impressorum

Catalog electronic de căutare pentru cărțile din secolul al XVI-lea aflate în
**Biblioteca Teleki-Bolyai** din Târgu-Mureș, după ediția tipărită
*Catalogus Librorum Sedecimo Saeculo Impressorum Bibliothecae Teleki-Bolyai*
(Biblioteca Județeană Mureș, 2001, Tom. I & II).

Server local stdlib Python + frontend bilingv RO/HU, fără dependențe externe.

## Caracteristici

- **2307 intrări** indexate (898 autori distincti, 442 locuri de apariție, interval **1310–1678**)
- **Căutare globală** + căutare avansată pe câmpuri (autor, titlu, loc, an de la / an până la)
- **Accent-insensitive**: caută `Bibliotheca` și „bibliothéca” identic (NFKD fold)
- **Filtre rapide pe deceniu** (1500-uri, 1510-uri, …) și sortare după autor / an / loc / cota
- **UI bilingv** (română / magyar) cu i18n complet pe interfață
- **Detalii intrare** cu cotă bibliotecă, descriere completă, ex libris și posesori istorici
- **PDF-urile celor 2 tomuri** servite local, deschidere directă la pagina exactă a intrării
- **Fațete distincte** (autori / locuri / ani) cu autocomplete în UI

## Stack

- **Backend**: `http.server` (stdlib Python, fără pip) — un singur fișier `server.py`
- **Date**: `catalog.json` (~2.5 MB) cu toate intrările parsate din ediția 2001
- **Frontend**: vanilla JS + HTML + CSS (fără build), datalist HTML pentru autocomplete
- **Indexare**: blob de căutare pre-calculat la pornire (NFKD-folded), fără bază de date

## Instalare și rulare

```bash
git clone https://github.com/intelink/catalog-teleki-bolyai.git
cd catalog-teleki-bolyai
python3 server.py
# → http://localhost:8970/
```

Niciun `pip install`, niciun `node_modules`. Funcționează cu Python 3.8+ stdlib.

## Endpoints API

| Path                       | Descriere                                              |
|----------------------------|--------------------------------------------------------|
| `GET /`                    | Index HTML al aplicației                               |
| `GET /api/meta`            | Metadate catalog (totaluri, intervale)                 |
| `GET /api/facets`          | Autori / locuri / ani distincti, cu count              |
| `GET /api/search?...`      | Căutare cu `q`, `author`, `title`, `place`, `year_from`, `year_to`, `sort`, `offset`, `limit` |
| `GET /api/entry/<id>`      | Detaliile unei intrări (după cota catalogului)         |
| `GET /16_vol_I_full.pdf`   | Tom. I, PDF complet                                    |
| `GET /16_vol_II.pdf`       | Tom. II, PDF complet                                   |
| `GET /INSTR_UTIL_17.pdf`   | Ghid de utilizare (în RO)                              |

## Autostart (systemd, opțional)

```ini
# /etc/systemd/system/catalog-teleki.service
[Unit]
Description=Catalog Teleki-Bolyai (port 8970)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=eae
WorkingDirectory=/home/eae/Documents/catalog-teleki
ExecStart=/usr/bin/python3 /home/eae/Documents/catalog-teleki/server.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now catalog-teleki.service
```

## Sursă

Catalogul tipărit *Catalogus Librorum Sedecimo Saeculo Impressorum Bibliothecae
Teleki-Bolyai* (ed. Biblioteca Județeană Mureș, Târgu-Mureș, 2001) — datele
JSON sunt parsate din cele două tomuri PDF incluse în repo.

## Licență

Software-ul (server.py, app.js, styles.css, index.html) este publicat sub
licență permisivă pentru uz academic și personal. PDF-urile sursă și catalogul
sunt opere derivate din ediția tipărită a Bibliotecii Județene Mureș (2001) —
folosire în scop documentar și de cercetare.
