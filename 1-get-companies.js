/*
Crawls and parses swissmem members/groups.

Requires node.js to be installed: https://nodejs.org/en/download/
Run: node <this file> e.g. node 1-get-companies.js
Writes Files in current directory: categories.csv, categories.json, companies.csv, companies.json
*/

const osmosis = require('osmosis')
const fs = require('fs')
const promisify = require('util').promisify
const writeFile = promisify(fs.writeFile)
const toCsv = promisify(require('jsonexport'))

const baseurl = 'https://www.swissmem.ch'
const starturl = '/de/organisation-mitglieder/fachgruppen.html'

let getCategories = () =>
  new Promise(resolve => {
    let categories = []
    osmosis
      .get(`${baseurl}${starturl}`)
      .find('p.bodytext a')
      .set({
        link: '@href',
        name: '.'
      })
      .data(category => categories.push(category))
      .done(() => resolve(categories))
  })

let getCompanies = categories => {
  let retrieveCompanyPromises = categories.map(category => {
    return new Promise(resolve => {
      let companies = []
      osmosis
        .get(`${baseurl}/${category.link}`)
        .find('div.ctElementWrap ul li a')
        .set({
          url: '@href',
          name: '.'
        })
        .data(company => {
          company.url = company.url.replace(/\r/g, '')
          companies.push({ category: category.name, ...company })
        })
        .done(() => resolve(companies))
    })
  })
  return Promise.all(retrieveCompanyPromises).then(companies => ([].concat(...companies)))
}

async function crawl () {
  const categoriesPath = process.argv[2] || 'categories'
  const companiesPath = process.argv[3] || 'companies'
  let categories = await getCategories()
  let companies = await getCompanies(categories)
  await writeFile(`${categoriesPath}.json`, JSON.stringify(categories, null, 2), 'utf8')
  await writeFile(`${companiesPath}.json`, JSON.stringify(companies, null, 2), 'utf8')
  await writeFile(`${categoriesPath}.csv`, await toCsv(categories), 'utf8')
  await writeFile(`${companiesPath}.csv`, await toCsv(companies), 'utf8')
}

crawl()
