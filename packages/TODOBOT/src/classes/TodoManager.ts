/* eslint-disable class-methods-use-this */
import { Todomodel } from '../modules/models'

export default class TodoManager {
  getOne(_id: string) {
    return Todomodel.findOne({ _id })
  }

  /**
   * @method getByMsg
   * @param {String} todomsg todomsg(id)
   * @param {String} guildid guildid(id)
   *
   * returns the todo by message id and channel
   */
  getByMsg(todomsg: string, guildid: string) {
    return Todomodel.findOne({ todomsg, guildid })
  }

  getGuild(guildid: string) {
    return Todomodel.find({ guildid })
  }

  getUser(user: string) {
    return Todomodel.find({ submittedby: user })
  }

  getProcessed(user: string) {
    return Todomodel.find({ assigned: user })
  }
}
