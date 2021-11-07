import {
  SlashCommand,
  CommandOptionType,
  SlashCreator,
  CommandContext,
  AutocompleteContext,
  ComponentType,
  ButtonStyle
} from 'slash-create';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'hello',
      description: 'Says hello to you.',
      guildIDs: ['830557841710383206'],
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'food',
          description: 'What food do you really like?',
          autocomplete: false
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    if (ctx.options.food) return `You like ${ctx.options.food}? Nice!`;
    else {
      await ctx.defer();
      await ctx.send('here is some select', {
        embeds: [
          {
            author: {
              name: 'Todo Bot'
            },
            description: 'Some very nice embed description',
            color: 244233
          }
        ],
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.SELECT,
                custom_id: 'example_select',
                placeholder: 'Choose a task to mark as finished or unfinished',
                max_values: 1,
                options: [
                  {
                    default: false,
                    description: 'something',
                    label: 'a',
                    value: 'a'
                  },
                  {
                    default: false,
                    description: 'something',
                    label: 'b',
                    value: 'b'
                  },
                  {
                    default: false,
                    description: 'something',
                    label: 'c',
                    value: 'c'
                  }
                ]
              }
            ]
          },
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'button',
                custom_id: 'example_button',
                emoji: {
                  name: '👌'
                }
              }
            ]
          }
        ]
      });
      ctx.registerComponent('example_select', async (btnCtx) => {
        console.log(btnCtx);
        await btnCtx.editParent('You chose: ' + btnCtx.values[0]);
      });
      ctx.registerComponent('example_button', async (btnCtx) => {
        await btnCtx.editParent('You clicked the button!');
      });
    }
  }
  async autocomplete(ctx: AutocompleteContext) {
    const optiones = ['apple', 'banana', 'orange', 'pineapple'];
    const res = [];
    console.log(ctx.options);
    for (let index = 0; index < optiones.length; index++) {
      if (optiones[index].includes(ctx.options.food))
        res.push({
          name: optiones[index],
          value: optiones[index]
        });
    }
    ctx.sendResults(res);
  }
}
