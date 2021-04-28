// eslint-disable-next-line import/no-extraneous-dependencies
const parseChangelog = require('changelog-parser')
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const text = readFileSync(join(__dirname, '../CHANGELOG.md')).toString()

/**
  IDEA:
    - Custom updater gives me new version, ill then write it to a json file as well as the old version
    - changelog json generator then reads the file and generates a new json changelog
    - keep only the latest changelog.json for the bot to use when a user runs the /news cmd
    - /news -> shows nice little embed with the latest news (changelog from current to old version) plus a link to where the entire
      changelog lives (github)
*/

parseChangelog({ text }, (err, result) => {
    if (err) throw err
    writeFileSync(join(__dirname, '../CHANGELOG.json'), JSON.stringify(result))
})
