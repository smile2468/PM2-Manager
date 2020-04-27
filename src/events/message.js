class Event {
  constructor (client) {
    this.client = client
    this.name = 'message'
    this.listener = (...args) => this.run(...args)
  }

  async run (message) {
    this.handler(message)
  }

  async handler (message) {
    if (message.author.bot || message.system) return
    const prefix = this.client._options.bot.prefix()
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const Command = this.client.commands.get(command) || this.client.aliases.get(command)

    if (message.content.startsWith(prefix) && Command) {
      if (message.channel.type === 'dm') return message.channel.send('❌ Commands are not available on **DM** Channels!')
      const compressed = {
        message: message,
        args: args,
        prefix: prefix
      }
      if (this.client._options.bot.owner.includes(message.author.id)) {
        return Command.run(compressed).catch(err => {
          this.client.logger.warn(`[Handler:Error] Error executing command... (${err.name} | ${err.stack})`)
        })
      }
    }
  }
}

module.exports = Event
