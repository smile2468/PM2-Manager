class Event {
  constructor (client) {
    this.client = client
    this.name = 'ready'
    this.listener = (...args) => this.run(...args)
  }

  async run () {
    const activityText = this.client.inspection ? this.client._options.bot.activity.text.development : this.client._options.bot.activity.text.service
    this.client.user.setActivity(activityText, { type: 'PLAYING', url: 'https://twitch.tv/undefined' })
    this.client.logger.debug(`[Activity:Set] Settings Activity to ${activityText}`)
    this.client.logger.info(`[Init:Login] Logged as ${this.client.user.tag}(${this.client.user.id})`)
    this.client.initialized = true
  }
}

module.exports = Event
