/* eslint-disable class-methods-use-this */
import Todomodel from '../modules/models/todomodel'

export default class TodoManager {
    // eslint-disable-next-line class-methods-use-this
    getOneTodo(_id: string) {
        return Todomodel.findOne({ _id })
    }

    getByMsg(todomsg: string, guildid: string) {
        return Todomodel.findOne({ todomsg, guildid })
    }

    /**
     *  client.decorate('getguildtodos', async (guildid) => todomodel.find({ guildid }))

        client.decorate('querytodos', (queryobj) => todomodel.find({ queryobj }))

        client.decorate('getusertodos', (user) => todomodel.find({ submittedby: user }))

        client.decorate('getprocessedtodos', (user) => todomodel.find({ assigned: user }))

    */
}
