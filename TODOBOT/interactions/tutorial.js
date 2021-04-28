/**
 * @fileoverview 
 * Kindly stolen from https://github.com/Giuliopime/HelpDesk/blob/master/commands/Utility/tutorial.js
 */
const { MessageEmbed } = require('discord.js-light'),
    pkg = require('../../package.json');

const raw = {
    name: 'tutorial',
    description: 'Get a short tutorial on how to use the bot.'
}
module.exports = {
    raw,
    id: "",
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        permLevel: 'USER',
    },
    help: {
        category: 'System',
        description: raw.description
    },
    run: async (client, interaction) => {
        interaction.reply(' ', 5);
        // Define the arrays of the commands separed by category
        const pages = [' ', 'Set up the bot', 'Create your first todo', 'Create your first custom command', 'Advanced Custom Commands', 'Other Commands'];
        let page = 1;
        const tutorialEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Welcome to the Tutorial!')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Let's get started!\nNavigate trough this tutorial sections to learn how to use <@${client.user.id}>.`)
            .addFields(
                {
                    name: 'Tutorial Sections',
                    value: `**-** Introduction (this page)
                    **-** Set up the bot
                    **-** Create your first todo
                    **-** Create your first custom command
                    **-** Other Commands`
                },
                {
                    name: 'How to move trough this tutorial',
                    value: 'Use reactions below to navigate trough the tutorial pages'
                },
            )
            .setFooter(`Page ${page} of ${pages.length}`);
        interaction.channel.send(tutorialEmbed).then(async msg => {
            interaction.delete();
            const nextEmoji = '➡';
            const stopEmoji = '❌';
            const beforeEmoji = '◀️';
            await msg.react(beforeEmoji);
            await msg.react(stopEmoji);
            await msg.react(nextEmoji);
            const Filter = (reaction, user) => (reaction.emoji.name === beforeEmoji || reaction.emoji.name === nextEmoji || reaction.emoji.name === stopEmoji) && user.id === interaction.member.user.id && user.id !== client.user.id;
            const otherFilter = (reaction, user) => (reaction.emoji.name !== beforeEmoji && reaction.emoji.name !== nextEmoji && reaction.emoji.name !== stopEmoji) || (user.id !== interaction.member.id && user.id !== client.user.id);
            const update = msg.createReactionCollector(Filter, { time: 600000 });
            const other = msg.createReactionCollector(otherFilter, { time: 600000 });
            let time = Date.now();
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            other.on('collect', (r, u) => {
                r.users.remove(u);
            });
            update.on('collect', async (r, u) => {
                time = Date.now();
                if (r.emoji.name === stopEmoji) {
                    update.stop();
                }
                if (r.emoji.name === nextEmoji) {
                    if (page === pages.length) return r.users.remove(u);
                    page++;
                    await r.users.remove(u);
                    tutorialEmbed.setFooter(`Page ${page} of ${pages.length}`);
                }
                if (r.emoji.name === beforeEmoji) {
                    if (page === 1) return r.users.remove(u);
                    page--;
                    await r.users.remove(u);
                    tutorialEmbed.setFooter(`Page ${page} of ${pages.length}`);
                }
                if (page === 1) {
                    tutorialEmbed
                        .setTitle('Welcome to the Tutorial!')
                        .setThumbnail(client.user.displayAvatarURL())
                        .setDescription(`Let's get started!\nNavigate trough this tutorial sections to learn how to use <@${client.user.id}>.`);
                    tutorialEmbed.fields = [
                        {
                            name: 'Tutorial Sections',
                            value: `**-** Introduction (this page)
                                **•** Set up the bot
                                **•** Create your first todo
                                **•** Create your first custom command
                                **•** Other Commands`
                        },
                        {
                            name: 'How to move trough this tutorial',
                            value: 'Use reactions below to navigate trough the tutorial pages'
                        },
                    ];
                    tutorialEmbed.image = undefined;
                }
                if (page === 2) {
                    tutorialEmbed
                        .setTitle(pages[page - 1])
                        .setDescription(`
                            To set up the bot use the \`/settings set\` command. Thanks to discords new slash commands you can just click the value that you want to edit and enter your new value.
                            
                            __**Values:**__

                            **•** \`todochannel\` => the channel where your tasks will be posted.
                            **•** \`readonlychannel\` => the channel where shared tods will be posted. The shared messages will be updated as you progress with the todo.
                            **•** \`staffrole\` => members with this role can edit bot settings and create custom commands.
                            **•** \`userrole\` => members with this role can interact with the bot and create todos.
                            **•** \`language\` => the language in which the bot will talk to you.
                            `);
                    tutorialEmbed.image = undefined;
                    tutorialEmbed.thumbnail = undefined;
                    tutorialEmbed.fields = [];
                }
                if (page === 3) {
                    tutorialEmbed
                        .setTitle(pages[page - 1])
                        .setDescription(`To create a todo simply run the \`/todo\` command and submit at least a title. Once the todo is submitted it will be posted in your preconfigured todochannel. From there on everything else is done with reactions.
                        
                        **Note** To submit multiple tasks within a TODO, simply seperate them with a semicolon (;).
                        `)
                        .setImage('https://raw.githubusercontent.com/shitcorp/TODOBOT/develop/assets/todo_cmd_demo.gif')
                        .setThumbnail(client.user.displayAvatarURL());
                    tutorialEmbed.fields = [];
                }
                if (page === 4) {
                    tutorialEmbed
                        .setTitle(pages[page - 1])
                        .setDescription(`
                        To create a custom command, use the command \`/tag learn\`. The name will be the command and the content is what the bot will return. For more advanced usage you can do stuff like embeds and more.
                        `)
                        .setImage('https://cdn.discordapp.com/attachments/822998851848765440/822999581767630869/tagcmd_demo.gif');
                    tutorialEmbed.fields = [];
                }
                if (page === 5) {
                    tutorialEmbed
                        .setTitle(pages[page - 1])
                        .setDescription(`
                        If you want to build custom commands where you show your users information that could change theres something called variables that you can set and use in your custom commands. Set a new variable with the coand \`/var create\`. Then you can use the variable like this \`<%name%>\` in your custom commands.
                        `)
                        .setImage('https://cdn.discordapp.com/attachments/823001120590528532/823002155983568896/vars_demo.gif');
                }
                if (page === 6) {
                    tutorialEmbed
                        .setTitle(pages[page - 1])
                        .setDescription(`
                        You can always run \`/help\` to see all available commands. If you want to learn more about a specific command just do \`help <commandname>\`. Some important ones are:

                        **•** \`blacklist\` => blacklist users and or channels from bot usage
                        **•** \`shorten\` => shorten a link (theres even multiple domains to choose from)
                        **•** \`reminder\` => create small reminders and get pinged when the time expires
                        **•** \`suggest\` => Suggest new features to be added into the bot


                        *This ends the tutorial, I hope it was helpful to you. Here are some other useful links:*
                        
                        [Support](https://discord.gg/RuEdX5T)       |       [Invite](https://invite.todo-bot.xyz)      |        [Wiki](${pkg.repository.url}#readme)`);
                    tutorialEmbed.image = undefined;
                    tutorialEmbed.thumbnail = undefined;
                    tutorialEmbed.fields = [];
                }

                await msg.edit(tutorialEmbed);
            });
            update.on('end', async () => {
                time = undefined;
                await msg.reactions.removeAll();
            });
            let condition = true;
            while (condition) {
                if (!time) condition = false;
                await sleep(30000);
                if (Date.now() - time >= 300000) {
                    condition = false;
                    update.stop();
                }
            }
        });

    }
};
