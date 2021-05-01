const path = require('path')
const dotenv = require('dotenv')
const prompts = require('prompts')
const { readdirSync } = require('fs')
const { DiscordInteractions } = require('slash-commands')

// load our env variables
dotenv.config()

const config = {
    applicationId: process.env.APPLICATION_ID,
    authToken: process.env.TOKEN,
    publicKey: process.env.PUBLIC_KEY,
}

const choices = []

readdirSync(path.join(`${__dirname}../../../interactions`))
    .filter((f) => !f.startsWith('_') && f.endsWith('.js'))
    .forEach((f) => {
        choices.push({
            title: f.replace('.js', ''),
            value: f,
        })
    })

const questions = [
    {
        type: 'multiselect',
        name: 'commands',
        message: 'Which command/s do you want to register?',
        choices,
    },
]

;(async () => {
    const response = await prompts(questions)

    if (!response.commands) return
    const interaction = new DiscordInteractions(config)
    for (const c of response.commands) {
        const { raw } = await require(path.join(__dirname, `../../../interactions/${c}`))
        await interaction
            .createApplicationCommand(raw)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((data) => {
                if (data.message && data.message.includes('401: Unauthorized')) {
                    // print unauthorized error
                    console.error(`
                  _________________________________
                  [401] Unauthorized
                  Failed to register the command, check
                  your .env file if you have the correct
                  token, application id and public key
                  and try again.
                  
                  _________________________________
                  `)
                } else if (data.message && data.message.includes('Invalid Form Body')) {
                    console.error(data.errors)
                    console.error(`
                  _________________________________
                  [503] Invalid Form Body
                  Failed to register the command, check
                  your command formatting and try again.
                  
                  _________________________________
          `)
                } else {
                    console.error(data)
                }
                if (data.id) {
                    console.log(`
                  _________________________________
                  
                  Registered the following command:
                  
                  ID:          ${data.id}
                  App_ID:      ${data.application_id}
                  Name:        ${data.name}
                  Desc:        ${data.description}
                  
                  _________________________________`)
                } else console.error(data)
            })
            .catch(console.error)
    }
})()
