class Command {
  constructor (client) {
    this.client = client

    this.command = {
      name: 'stop',
      aliases: ['스탑', 'wjdwl', '정지', 'shutdown', '셧다운']
    }
    this.dir = __filename
  }

  async run (compressed) {
    this.client.pm2.stop(compressed)
  }
}

module.exports = Command
