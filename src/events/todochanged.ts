import { Todo, MyClient } from '../classes'

export default async (client: MyClient, todoobj: Todo) => {
  if (!todoobj.readonlychannel || todoobj.readonlychannel === '') return
  if (!todoobj.readonlymessage || todoobj.readonlymessage === '') return
  try {
    const channel = await client.channels.fetch(todoobj.readonlychannel)
    if (!channel.isText()) return
    const msg = await channel.messages.fetch(todoobj.readonlymessage)
    await msg.edit(client.embed.todo(todoobj))
  } catch (e) {
    client.logger.debug(e)
  }
}
