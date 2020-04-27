class Command {
  constructor (client) {
    this.client = client

    this.command = {
      name: 'list',
      aliases: ['ㅣㅑㄴㅅ', '리스트', '목록']
    }
    this.dir = __filename
  }

  async run (compressed) {
    this.client.pm2.list(compressed)
  }
}

module.exports = Command
