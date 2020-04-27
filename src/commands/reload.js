class Command {
  constructor (client) {
    this.client = client

    this.command = {
      name: 'reload',
      aliases: ['ㄱ디ㅐㅁㅇ', '리로드', 'flfhem']
    }
    this.dir = __filename
  }

  async run (compressed) {
    this.client.reload(compressed)
  }
}

module.exports = Command
