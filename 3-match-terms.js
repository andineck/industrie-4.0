/*
Matches different Search Terms like e.g. Industrie 4.0:

Matchers (Regular Expressions):
const industry40Matcher = /industr(ie|y)\s?4\.0/gi
const digitalizationMatcher = /digitali(zation|sation|sierung|sieren)/gi
const iotMatcher = /(IoT|[Ii]nternet\s?[Oo]f\s?[Tt]hings|[Ii]nternet\s?[Dd]er\s?[Dd]inge)/g
const innovationMatcher = /innovati(on|iv)/gi
const smartMatcher = /smart/gi

Requires node.js to be installed: https://nodejs.org/en/download/
Run: node <this file> e.g. node 3-match-terms.js
Reads the File: companies.json-industry-4-0.json in the current directory (or the file in the first argument)
Writes Files in current directory: companies.json-industry-4-0.json-match-terms.json
*/

const fs = require('fs')
const promisify = require('util').promisify
const path = require('path')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const toCsv = promisify(require('jsonexport'))
const industry40Matcher = /industr(ie|y)\s?4\.0/gi
const digitalizationMatcher = /digitali(zation|sation|sierung|sieren)/gi
const iotMatcher = /(IoT|[Ii]nternet\s?[Oo]f\s?[Tt]hings|[Ii]nternet\s?[Dd]er\s?[Dd]inge)/g
const innovationMatcher = /innovati(on|iv)/gi
const smartMatcher = /smart/gi

async function match () {
  const companiesPath = path.resolve(process.argv[2] || 'companies.json-industry-4-0.json')
  const companiesString = await readFile(companiesPath, 'utf8')
  let companies = JSON.parse(companiesString)
  companies.map(p => {
    p.industry40 = p.text.match(industry40Matcher) ? 'MATCH' : 'NOTHING'
    p.digitalization = p.text.match(digitalizationMatcher) ? 'MATCH' : 'NOTHING'
    p.iot = p.text.match(iotMatcher) ? 'MATCH' : 'NOTHING'
    p.innovation = p.text.match(innovationMatcher) ? 'MATCH' : 'NOTHING'
    p.smart = p.text.match(smartMatcher) ? 'MATCH' : 'NOTHING'
    return p
  }).map(p => {
    p.buzzword = (
      p.industry40 === 'MATCH' ||
      p.digitalization === 'MATCH' ||
      p.iot === 'MATCH' ||
      p.innovation === 'MATCH' ||
      p.smart === 'MATCH')
      ? 'TRUE' : 'FALSE'
    return p
  })
  await writeFile(
    `${companiesPath}-match-terms.json`,
    JSON.stringify(companies, null, 2),
    'utf8'
  )
  await writeFile(
    `${companiesPath}-match-terms.csv`,
    await toCsv(companies.map(c => {
      delete c.text
      return c
    })),
    'utf8'
  )
}

match()
