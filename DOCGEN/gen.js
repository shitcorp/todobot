/* eslint-disable no-console */
/* eslint-disable global-require */
const { readdirSync, writeFileSync, readFileSync } = require('fs')
const { join } = require('path')

let TOCString = ``
const tableHeader = `| Name | Description | Type | Required? | \n| :-- | :-- | :-- | :-- | \n`
const typeMap = {
    3: 'String (Text)',
    4: 'Number (0, 1, 2, 3, 4 ...)',
    5: 'Boolean (true or false)',
    6: 'User',
    7: 'Channel',
    8: 'Role',
}

function parseOption({ name, description, type, required = false }) {
    return `| ${name} | ${description} | ${typeMap[type]} | ${required === false ? '❌' : '✔️'} | \n`
}

const files = readdirSync(join(__dirname, '../TODOBOT/interactions'))

files
    .filter((f) => f.endsWith('.js') && !f.includes('_') && !f.includes('.template'))
    .forEach((file) => {
        const cmdName = file.replace('.js', '')
        let docString = ''
        docString += `# /${cmdName}`
        // eslint-disable-next-line import/no-dynamic-require
        const { raw } = require(join(__dirname, `../TODOBOT/interactions/${file}`))
        TOCString += ` - [${cmdName}](./docs/${cmdName} "${raw.description}") \n`

        if (Object.keys(raw).includes('options')) {
            let output = ''
            let argTable = tableHeader
            raw.options.forEach((option) => {
                switch (option.type) {
                    default:
                        argTable += parseOption(option)
                        break
                    case 1:
                        output += `## /${cmdName} ${option.name} \n\n`
                        if (option.options) {
                            output += tableHeader
                            option.options.forEach((o) => {
                                output += parseOption(o)
                            })
                        } else {
                            output += `No arguments required. Description: \n> ${option.description} \n <br>`
                        }
                        break
                }
            })
            docString += `\n> ${raw.description} \n`
            if (argTable !== tableHeader) docString += `\n# Arguments\n\n${argTable}\n`
            if (output !== '') docString += `\n# Subcommands\n\n${output}\n`
        } else {
            docString += `\n> ${raw.description}`
        }
        // add back button
        docString += `\n<br>\n [🔙 Go back](../README.md#%EF%B8%8F-commands)`
        writeFileSync(join(__dirname, `../docs/${cmdName}.md`), docString)
        console.log(`Finished generating docs for ${cmdName}.`)
    })
;(async function writeReadme() {
    const currentReadme = readFileSync(join(__dirname, `../README.md`)).toString()

    const startTag = '<!--STARTCMDSECTION-->'
    const endTag = '<!--ENDCMDSECTION-->'

    const startIndex = currentReadme.indexOf(startTag) + startTag.length
    const endIndex = currentReadme.indexOf(endTag)

    writeFileSync(
        join(__dirname, `../README.md`),
        `${currentReadme.substring(0, startIndex)}\n\n${TOCString}\n\n${currentReadme.substring(
            endIndex,
            currentReadme.length,
        )}`,
    )
    console.log(`Finished adding new commands section to readme.`)
})()
