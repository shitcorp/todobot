/* eslint-disable class-methods-use-this */
import { Remindermodel } from '../modules/models'

export default class ReminderManager {
  set = (reminderobj) => new Remindermodel(reminderobj).save()

  getByUser = (user: string) => Remindermodel.find({ user })
}
