const Discord = require('discord.js')
const { Logger, globAsync, PM2 } = require('./src/utils')

class DiscordClient extends Discord.Client {
  constructor (options) {
    super()

    this._options = options
    this.utils = require('./src/utils')
    this.utils.globAsync = globAsync
    this.utils.wait = require('util').promisify(setTimeout)
    this.logger = new Logger(this)
    this.pm2 = new PM2(this)

    this.events = new Discord.Collection()
    this.commands = new Discord.Collection()
    this.aliases = new Discord.Collection()

    this.inspection = this._options.selectMode().check

    this.events_loaded = false
    this.commands_loaded = false

    this.initialized = false
  }

  async init () {
    if (this.initialized) {
      this.logger.info('[Init] Bot is Already initialized!')
      return new Error('[Init] Bot is Already initialized!')
    }
    this.logger.info(`[Init:Info] Selected Mode: ${this.inspection ? 'Inspection' : 'Service'}`)
    this.logger.warn('[Init] Initializing...')

    this.loadEvents()
    this.loadCommands()
    this.pm2.init()

    this.login(this._options.bot.token)

    module.exports = this
  }

  async loadEvents (reload = false) {
    this.logger.debug('[Event:Load] Loading Events...')

    const loadEvents = await this.utils.globAsync('./src/events/**/*.js')
    const ReloadOrLoad = `${this.events_loaded ? 'Reload' : 'Load'}`

    this.logger.info(`[Event:${ReloadOrLoad}] Loaded Events: ${loadEvents.length}`)
    this.logger.info(`[Event:${ReloadOrLoad}] Event Files: (${loadEvents.join(' | ')})`)

    for (const file of loadEvents) {
      const Event = require(file)
      const event = new Event(this)
      if (reload) {
        const { listener } = this.events.get(event.name)
        if (listener) {
          this.removeListener(event.name, listener)
          this.logger.warn(`[Event:${ReloadOrLoad}] Removing Event Listener for Event ${event.name}`)
          this.events.delete(event.name)
        }
      }
      delete require.cache[require.resolve(file)]
      this.logger.info(`[Event:${ReloadOrLoad}] Added Event Listener for Event ${event.name}`)
      this.events.set(event.name, event)
      this.on(event.name, event.listener)
    }
    this.events_loaded = true
    this.logger.info(`[Event:${ReloadOrLoad}] Successfully ${ReloadOrLoad}ed Events!`)
    return this.events
  }

  async loadCommands () {
    this.logger.debug('[Command:Load] Loading Commands...')

    const loadCommands = await this.utils.globAsync('./src/commands/**/*.js')
    const ReloadOrLoad = `${this.commands_loaded ? 'Reload' : 'Load'}`

    this.logger.info(`[Command:${ReloadOrLoad}] ${ReloadOrLoad}ed Commands: ${loadCommands.length}`)
    this.logger.info(`[Command:${ReloadOrLoad}] Command Files: (${loadCommands.join(' | ')})`)

    for (const cmd of loadCommands) {
      const Command = require(cmd)
      const command = new Command(this)

      this.logger.debug(`[Command:${ReloadOrLoad}] Command Set: (${command.command.name})`)

      for (const aliases of command.command.aliases) {
        this.logger.debug(`[Command:${ReloadOrLoad}] Aliases Set: (${aliases}) of ${command.command.name}`)
        this.aliases.set(aliases, command)
      }
      delete require.cache[require.resolve(cmd)]
      this.commands.set(command.command.name, command)
    }
    this.commands_loaded = true
    this.logger.info(`[Command:${ReloadOrLoad}] Successfully ${ReloadOrLoad}ed Commands!`)
    return this.commands
  }

  async reload (compressed) {
    const { message } = compressed
    const loadEmoji = this.emojis.cache.get('631441912024399878')
    message.channel.send(`${loadEmoji} 명령어 리로드 중...`).then(async msg => {
      const Commands = await this.loadCommands()
      await msg.edit(`✅ 명령어 리로드 완료! (${Commands.keyArray().length} 개)\n${loadEmoji} 이벤트 리로드 중...`)

      const Events = await this.loadEvents(true)
      await msg.edit(`✅ 명령어 리로드 완료! (${Commands.keyArray().length} 개)\n✅ 이벤트 리로드 완료! (${Events.keyArray().length} 개)\n${loadEmoji} 설정 리로드 중...`)

      delete require.cache[require.resolve('./src/settings')]
      this._options = require('./src/settings')
      await msg.edit(`✅ 명령어 리로드 완료! (${Commands.keyArray().length} 개)\n✅ 이벤트 리로드 완료! (${Events.keyArray().length} 개)\n✅ 설정 리로드 완료!\n${loadEmoji} 유틸 리로드 중...`)

      delete require.cache[require.resolve('./src/utils')]
      delete require.cache[require.resolve('./src/utils/clean')]
      delete require.cache[require.resolve('./src/utils/globAsync')]
      delete require.cache[require.resolve('./src/utils/logger')]
      delete require.cache[require.resolve('./src/utils/pm2')]
      const { Logger, globAsync, PM2 } = require('./src/utils')
      this.utils = require('./src/utils')
      this.utils.globAsync = globAsync
      this.utils.wait = require('util').promisify(setTimeout)
      this.logger = new Logger(this)
      this.pm2 = new PM2(this)
      this.pm2.init()
      await msg.edit(`✅ 명령어 리로드 완료! (${Commands.keyArray().length} 개)\n✅ 이벤트 리로드 완료! (${Events.keyArray().length} 개)\n✅ 설정 리로드 완료!\n✅ 유틸 리로드 완료!\n🛠 모든 구성요소가 리로드 되었습니다!`)
    })
  }
}

const Client = new DiscordClient(require('./src/settings'))
Client.init()

process.on('uncaughtException', error => Client.logger.error(error.stack || error))
process.on('unhandledRejection', (reason, promise) => Client.logger.error(reason))
