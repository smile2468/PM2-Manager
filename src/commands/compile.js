const Discord = require('discord.js')
const child = require('child_process')

const Input = 'const Discord = require(\'discord.js\')\nconst child = require(\'child_process\')\n'

class Command {
  constructor (client) {
    this.client = client

    this.command = {
      name: 'compile',
      aliases: ['cmd', 'eval']
    }
    this.dir = __filename
  }

  async run (compressed) {
    const { message, args } = compressed
    const msg = message
    const cmd = Input + args.join(' ')
    const client = this.client

    let type
    new Promise(resolve => resolve(eval(cmd))).then(async res => {
      let code = type = res
      if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 })
      if (typeof type === 'function') code = type.toString()

      if (code.includes(this.client.token) === true) code = code.replace(this.client.token, '🌐 Replace Token')
      if (code.includes(this.client._options.bot.token) === true) code = code.replace(this.client._options.bot.token, '🌐 Replace Token')

      const successEmbed = new Discord.MessageEmbed()
        .setColor(this.client._options.colors.default)
        .setTitle('Code Exec')
        .addField('📥 Input', `\`\`\`js\n${String(cmd).length > 983 ? this.client.utils.clean(String(cmd).substring(0, 983) + '\n//And much more...') : this.client.utils.clean(cmd)}\n\`\`\``)
        .addField('📤 Output', `\`\`\`js\n${String(code).length > 983 ? this.client.utils.clean(String(code).substring(0, 983) + '\n//And much more...') : this.client.utils.clean(code)}\n\`\`\``)
      message.channel.send(successEmbed)
    }).catch(Ecmd => {
      const errorEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Error!')
        .addField('📥 Input', `\`\`\`js\n${String(cmd).length > 983 ? this.client.utils.clean(String(cmd).substring(0, 983) + '\n//And much more...') : this.client.utils.clean(cmd)}\n\`\`\``)
        .addField('📤 Output', `\`\`\`js\n${String(Ecmd).length > 983 ? this.client.utils.clean(String(Ecmd).substring(0, 983) + '\n//And much more...') : this.client.utils.clean(Ecmd)}\n\`\`\``)
      message.channel.send(errorEmbed)
    })
  }

  isJSON (code) {
    try {
      JSON.parse(code)
      return true
    } catch (e) {
      return false
    }
  }
}

module.exports = Command
