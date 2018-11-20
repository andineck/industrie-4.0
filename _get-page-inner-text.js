/*
parses the given pages, stores the pages pdf files and returns the pages innerText.
*/
const { cpus } = require('os')
const path = require('path')
const { Cluster } = require('puppeteer-cluster')

const getPageText = async ({ filePath, pages }) => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: cpus().length
  })

  const texts = []

  await cluster.task(async ({ page, data }) => {
    await page.goto(data.url)
    page.on('console', msg => console.log(msg.text()))

    const fileName = path.resolve(filePath, data.url.replace(/\W+/g, '_'))
    await page.pdf({ path: `${fileName}.pdf` })
    const innerText = await page.evaluate(() => document.body.innerText)
    console.log('crawled', data.url)
    texts.push({ ...data, text: innerText })
  })

  cluster.on('taskerror', (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`)
  })

  for (const page of pages) {
    cluster.queue(page)
  }

  // many more pages
  await cluster.idle()
  console.log('texts', texts)
  await cluster.close()
  return texts
}
module.exports.getPageText = getPageText
