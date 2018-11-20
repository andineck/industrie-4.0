/*
Crawls and parses the given website urls with a headless browser, therefore client side applications are also supported.

Requires node.js to be installed: https://nodejs.org/en/download/
Run: node <this file> e.g. node 2-get-pages.js
Reads the File: companies.json in the current directory (or the file in the first argument)
Writes Files in current directory: companies-industry-4-0.csv, companies-industry-4-0.json, and
writes the Pages as pdf files in the pages subdirectory.
*/

const fs = require('fs')
const promisify = require('util').promisify
const path = require('path')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const toCsv = promisify(require('jsonexport'))
const getPageText = require('./_get-page-inner-text').getPageText

async function crawl () {
  const companiesPath = path.resolve(process.argv[2] || 'companies.json')
  const companiesString = await readFile(companiesPath, 'utf8')
  let companies = JSON.parse(companiesString)
  let pages = await getPageText({ filePath: './pages', pages: companies })

  await writeFile(
    `${companiesPath}-industry-4-0.json`,
    JSON.stringify(pages, null, 2),
    'utf8'
  )
  await writeFile(
    `${companiesPath}-industry-4-0.csv`,
    await toCsv(pages),
    'utf8'
  )
}

crawl()
