const { todomodel } = require("../modules/models/todomodel");
const todo = require("../classes/todo");
const messages = require("../localization/messages");

module.exports = async (client, messageReaction, user) => {
  const reactionTrans = client.apm.startTransaction(
    "MessageReactionAddEvent",
    "eventhandler"
  );

  client.apm.setUserContext({
    id: user.id,
    username: `${user.username}#${user.discriminator}`,
  });

  if (messageReaction.partial) {
    let messageFetchSpan = reactionTrans.startSpan("fetch_partial_message");
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      await messageReaction.fetch();
      if (messageFetchSpan) messageFetchSpan.end();
    } catch (error) {
      // Returns as `reaction.message.author` may be undefined/undefined
      if (messageFetchSpan) messageFetchSpan.end();
      return;
    }
  }

  let permSpan = reactionTrans.startSpan("permission_and_whitelist_checks");

  if (messageReaction.message.channel.type === "dm") return;

  const react = messageReaction.emoji.name;
  const userinio = user.id;

  const whitelisted_emojis = [
    "share",
    "edit",
    "assign_yourself",
    "expand",
    "collapse",
    "accept_todo",
    "finish",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
  ];

  // if the reacting user is us we should return
  if (userinio === client.user.id) return;

  // make sure we only do something if the reaction is allowed
  if (!whitelisted_emojis.includes(react)) return;

  const member = await client.guilds.cache
    .get(messageReaction.message.guild.id)
    .members.fetch(user.id);

  const settings = await client.getconfig(messageReaction.message.guild.id);
  if (settings === undefined) return;

  if (
    settings.todomode &&
    settings.todomode !== "advanced" &&
    messageReaction.message.channel.id !== settings.todochannel
  )
    return messageReaction.users.remove(userinio);
  if (
    !settings.todomode &&
    messageReaction.message.channel.id !== settings.todochannel
  )
    return messageReaction.users.remove(userinio);

  let level = 0;
  if (findCommonElements(member._roles, settings.userroles)) level = 1;
  if (findCommonElements(member._roles, settings.staffroles)) level = 2;
  if (member.hasPermission("MANAGE_GUILD")) level = 2;

  // if the user is not BOT_USER they cant use the reactions
  if (level < 1) return messageReaction.users.remove(userinio);

  let lang = settings ? (settings.lang ? settings.lang : "en") : "en";

  let todoobj = await client.gettodobymsg(
    messageReaction.message.id,
    messageReaction.message.guild.id
  );
  if (!todoobj) return;
  todoobj = new todo(client, todoobj);

  if (permSpan) permSpan.end();

  switch (react) {
    case "accept_todo":
      let acceptSpan = reactionTrans.startSpan("accept_todo_reaction");
      // add the reacting user to the assigned array,
      // mark the todo as assigned and edit the todo
      // message, then react with the white checkmark

      if (!todoobj.assigned.includes(userinio)) todoobj.assigned.push(userinio);

      todoobj.state = "assigned";
      todoobj.time_started = `${Date.now()}`;

      await client.updatetodo(todoobj._id, todoobj);

      messageReaction.message.edit(client.todo(todoobj)).then(async () => {
        if (todoobj.shared && todoobj.shared === true)
          client.emit("todochanged", todoobj, client);
        await messageReaction.message.reactions.removeAll().catch((error) => {
          client.logger.debug(error);
        });
        await messageReaction.message.react(client.emojiMap["edit"]);
        await messageReaction.message.react(client.emojiMap["finish"]);
        await messageReaction.message.react(client.emojiMap["assign"]);
        if (todoobj.shared !== true)
          await messageReaction.message.react(client.emojiMap["share"]);
        if (todoobj.tasks) {
          for (let i = 0; i < todoobj.tasks.length; i++) {
            if (!todoobj.tasks[i].includes("finished_"))
              await messageReaction.message.react(client.emojiMap[i + 1]);
          }
        }
      });
      if (acceptSpan) acceptSpan.end();
      break;
    case "finish":
      let finishSpan = reactionTrans.startSpan("finish_todo_reaction");
      // mark the todo as finished (closed), or
      // restart/repost the todo when its repeating
      if (Object.values(todoobj.assigned).includes(userinio) !== true)
        return messageReaction.users.remove(userinio);
      // if not all tasks are finished we dont allow the todo list to be marked as finished
      if (
        todoobj.tasks &&
        todoobj.tasks.filter((task) => !task.includes("finished_")).length > 0
      ) {
        client.clearReactions(messageReaction.message, userinio);
        return todoobj.errordisplay(
          messageReaction.message,
          userinio,
          messages.cantclosetodo[lang]
        );
      }
      client.emit("todochanged", todoobj, client);
      if (todoobj.loop === true) {
        todoobj.state = "open";
        client.updatetodo(todoobj._id, todoobj);
        messageReaction.message.edit(client.todo(todoobj)).then(async (msg) => {
          await messageReaction.message.reactions
            .removeAll()
            .catch((error) => client.logger.debug(error));
          await msg.react(client.emojiMap["edit"]);
          await msg.react(client.emojiMap["assign"]);
        });
      } else {
        todoobj.state = "closed";
        todoobj.time_finished = `${Date.now()}`;
        client.updatetodo(todoobj._id, todoobj);
        messageReaction.message.edit(client.todo(todoobj)).then(async () => {
          await messageReaction.message.reactions
            .removeAll()
            .catch((error) => client.logger.debug(error));
          await messageReaction.message.react(client.emojiMap["expand"]);
          if (todoobj.shared && todoobj.shared !== true)
            await messageReaction.message.react(client.emojiMap["share"]);
        });
      }
      if (finishSpan) finishSpan.end();
      break;
    case "share":
      let shareSpan = reactionTrans.startSpan("share_todo_reaction");
      // send todo to read only channel
      if (settings.readonlychannel) {
        try {
          if (todoobj.shared === true) return messageReaction.remove();
          let rochan = await messageReaction.message.guild.channels.fetch(
            settings.readonlychannel
          );
          todoobj.shared = true;
          //todoobj.state = 'shared';
          todoobj.readonlychannel = rochan.id;
          let msg = await rochan.send(client.todo(todoobj));
          todoobj.readonlymessage = msg.id;
          await client.updatetodo(todoobj._id, todoobj);
          // remove the reaction so users cant share again
          messageReaction.remove();
          if (shareSpan) shareSpan.end();
        } catch (e) {
          client.logger.debug(e);
          if (shareSpan) shareSpan.end();
        }
      } else {
        todoobj.errordisplay(
          messageReaction.message,
          userinio,
          messages.noreadonlychannel[lang]
        );
        if (shareSpan) shareSpan.end();
      }
      if (shareSpan) shareSpan.end();
      break;
    case "assign_yourself":
      let assignSpan = reactionTrans.startSpan("assign_yourself_reaction");
      //add the reacting user to the assigned array
      // and edit the todo msg/embed
      if (Object.values(todoobj.assigned).includes(userinio) === true) {
        todoobj.errordisplay(
          messageReaction.message,
          userinio,
          messages.alreadyassigned[lang]
        );
        await client.clearReactions(messageReaction.message, userinio);
      } else {
        await todoobj.assign(userinio);
        await messageReaction.message.edit(client.todo(todoobj));
        await client.clearReactions(messageReaction.message, userinio);
        client.emit("todochanged", todoobj, client);
      }
      if (assignSpan) assignSpan.end();
      break;
    case "edit":
      let editSpan = client.apm.startSpan("edit_todo_reaction");
      // edit the task and edit the todo msg when finished
      if (todoobj.assigned === [] && userinio !== todoobj.submittedby)
        return await messageReaction.users.remove(user.id);
      if (
        Object.values(todoobj.assigned).length > 0 &&
        Object.values(todoobj.assigned).includes(userinio) === false &&
        todoobj.submittedby !== userinio
      )
        return await messageReaction.users.remove(user.id);
      await messageReaction.users.remove(user.id);
      await edit(messageReaction.message, userinio);
      if (editSpan) editSpan.end();
      break;
    case "expand":
      // Show more details
      showmore();
      break;
    case "collapse":
      showless();
      break;
    case "1️⃣":
    case "2️⃣":
    case "3️⃣":
    case "4️⃣":
    case "5️⃣":
    case "6️⃣":
    case "7️⃣":
    case "8️⃣":
    case "9️⃣":
    case "🔟":
      let taskSpan = reactionTrans.startSpan("mark_task_finished_reaction");
      // function to mark task as finished
      if (!todoobj.assigned.includes(userinio))
        return messageReaction.users.remove(user.id);
      if (todoobj.tasks[client.Mapemoji[react] - 1].includes("finished_"))
        todoobj.tasks[client.Mapemoji[react] - 1] = todoobj.tasks[
          client.Mapemoji[react] - 1
        ].replace("finished_", "");
      else
        todoobj.tasks[client.Mapemoji[react] - 1] =
          `finished_ ` + todoobj.tasks[client.Mapemoji[react] - 1];
      client.emit("todochanged", todoobj, client);
      await todomodel.updateOne({ _id: todoobj._id }, todoobj);
      await messageReaction.message.edit(client.todo(todoobj));
      await messageReaction.users.remove(user.id);
      if (taskSpan) taskSpan.end();
      break;
  }

  async function edit(message, user) {
    const timeout = 10000;
    const filter = (m) => m.author.id === user;
    const editUsageMessage = await message.channel.send(
      client.embed(messages.editReactionUsage[lang])
    );
    message.channel
      .awaitMessages(filter, { max: 1, time: 90000, errors: ["time"] })
      .then((collected) => {
        try {
          editUsageMessage.delete();
        } catch (e) {
          client.logger.debug("message sent by bot" + e);
        }

        const args = collected.first().content.split(",");

        // argument handler
        switch (args[0]) {
          case "title":
          case "loop":
          case "content":
          case "category":
          case "attachment":
            todoobj[args[0]] = args[1].includes("+")
              ? todoobj[args[0]] + args[1].replace("+", " ")
              : args[1];
            todomodel.updateOne({ _id: todoobj._id }, todoobj, (err) => {
              if (err) return client.logger.debug(err);
              messageReaction.message.edit(client.todo(todoobj));
              if (todoobj.shared && todoobj.shared === true)
                client.emit("todochanged", todoobj, client);
            });
            break;
          default:
            todoobj.errordisplay(
              messageReaction.message,
              user,
              messages.novalidkey[lang]
            );
        }
      })
      .catch((collected) => {
        // Delete message here
        // maybe dont log this to debug/elastic
        try {
          todoobj.errordisplay(
            messageReaction.message,
            user,
            messages.timeisuperror[lang]
          );
          editUsageMessage.delete();
        } catch (e) {}
      });
  }

  async function showmore() {
    todoobj.state = "detail";
    messageReaction.message.edit(client.todo(todoobj, "yes"));
    await messageReaction.message.reactions
      .removeAll()
      .catch((error) => client.logger.debug(error));
    await messageReaction.message.react(client.emojiMap["collapse"]);
  }

  async function showless() {
    todoobj.state = "closed";
    messageReaction.message.edit(client.todo(todoobj));
    await messageReaction.message.reactions
      .removeAll()
      .catch((error) => client.logger.debug(error));
    await messageReaction.message.react(client.emojiMap["expand"]);
  }

  client.apm.endTransaction("reaction_event_handled", Date.now());
};
