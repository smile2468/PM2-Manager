module.exports = {
  bot: {
    token: 'YOUR BOT TOKEN',
    prefix: () => {
      switch (selectMode().check) {
        case true: return 'p2'
        case false: return 'pm2'
        default: return 'p2'
      }
    },
    owner: ['DISCORD USER ID'],
    activity: {
      text: {
        service: 'SERVICE MODE',
        development: 'INSPECTION MODE'
      }
    }
  },
  logger: {
    level: 'debug'
  },
  colors: {
    default: '#ffc0cb',
    discord: '#7289DA',
    grayPurple: '#9b99ab',
    purple: '#884dff',
    hotPink: '#ff00e6',
    orange: '#fc7b03',
    cyan: '#00ffff'
  },
  page: ['◀', '⏹', '▶']
}

function selectMode () {
  switch (process.argv[2]) {
    case '--inspection': return { platform: process.platform, check: true }
    default: return { platform: process.platform, check: false }
  }
}

module.exports.selectMode = selectMode
