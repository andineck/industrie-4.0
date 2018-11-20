# Umsetzungsstand von Digitalisierung und Industrie 4.0 nach Branche

- Analyse der Industriezweige und Firmen gemäss `https://www.swissmem.ch/de/organisation-mitglieder/fachgruppen.html`
- Ermitteln der relativen Digitalisierung und Industrie 4.0 Umsetzungsgrade nach Industriezweig

## Ausführung der Skripte

Vorbedingung: Requires node.js to be installed: https://nodejs.org/en/download/

1. 1-get-companies.js
Run: node <this file> e.g. node 1-get-companies.js
Writes Files in current directory: categories.csv, categories.json, companies.csv, companies.json

2. 2-get-pages.js
Run: node <this file> e.g. node 2-get-pages.js
Crawls and parses the given website urls with a headless browser, therefore client side applications are also supported.
Reads the File: companies.json in the current directory (or the file in the first argument)
Writes Files in current directory: companies-industry-4-0.csv, companies-industry-4-0.json, and
writes the Pages as pdf files in the pages subdirectory.

3. 3-match-terms.js
Run: node <this file> e.g. node 3-match-terms.js
Reads the File: companies.json-industry-4-0.json in the current directory (or the file in the first argument)
Writes Files in current directory: companies.json-industry-4-0.json-match-terms.json


Used Matchers (Regular Expressions):
const industry40Matcher = /industr(ie|y)\s?4\.0/gi
const digitalizationMatcher = /digitali(zation|sation|sierung|sieren)/gi
const iotMatcher = /(IoT|[Ii]nternet\s?[Oo]f\s?[Tt]hings|[Ii]nternet\s?[Dd]er\s?[Dd]inge)/g
const innovationMatcher = /innovati(on|iv)/gi
const smartMatcher = /smart/gi


## Resultate

- die Dateien `categories...` und `companies...` enthalten die Resultate.
- unter [pages](pages/) sind die Screenshots der Webpages enthalten.