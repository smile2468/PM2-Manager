class Command {
  constructor (client) {
    this.client = client

    this.command = {
      name: 'restart',
      aliases: ['ㄱㄷㄴㅅㅁㄳ', '리스타트', '재시작', 'fltmxkxm', 'wotlwkr', '재부팅', 'woqnxld', 'reboot', '리붓', 'flqnt']
    }
    this.dir = __filename
  }

  async run (compressed) {
    this.client.pm2.restart(compressed)
  }
}

module.exports = Command
