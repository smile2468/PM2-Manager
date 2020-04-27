const { table, getBorderCharacters } = require('table')

class Command {
  constructor (client) {
    this.client = client

    this.command = {
      name: 'help',
      aliases: ['도움', '도움말', 'ㅗ디ㅔ', 'ehdnaakf', 'ehdna']
    }
    this.dir = __filename
  }

  async run (compressed) {
    const Commands = this.client.commands.filter(el => String(el.dir).includes('pm2')).array()
    const tableArray = [['명령어', '단축키']]
    for (const item of Commands) {
      tableArray.push([`'${item.command.name}'`, `'${item.command.aliases.map(el => el).join('\', \'')}'`])
    }
    const createTable = table(tableArray, { border: getBorderCharacters('void'), drawHorizontalLine: () => { return false } })
    compressed.message.channel.send(`\`\`\`js\n${createTable}\n\`\`\``)
  }
}

module.exports = Command
