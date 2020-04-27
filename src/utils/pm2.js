const pm2Module = require('pm2')
const { table, getBorderCharacters } = require('table')

class PM2 {
  constructor (client) {
    this.client = client
    this.processList = null
    this.process = []
  }

  init () {
    pm2Module.connect(err => {
      if (err) {
        this.client.logger.error(`[PM2:Connect] ${err}`)
        process.exit(2)
      }
    })
    this.client.logger.info('[PM2:Init] Connected PM2')
  }

  list (compressed, send = true) {
    const tableArray = [['ID', 'NAME', 'VERSION', 'MODE', '↺', 'STATUS', 'CPU', 'MEM']]
    pm2Module.list((err, list) => {
      if (err) {
        this.client.logger.error(`[PM2:List] ${err}`)
        process.exit(2)
      }

      this.processList = list

      for (const item of list) {
        tableArray.push([
          item.pm_id,
          item.name,
          item.pm2_env.version,
          item.pm2_env.exec_mode.split('_').shift(),
          item.pm2_env.restart_time,
          item.pm2_env.status,
          item.monit.cpu,
          (item.monit.memory / 1024 / 1024).toFixed()
        ])
        this.process.push({
          id: item.pm_id,
          name: item.name,
          monit: {
            cpu: item.monit.cpu,
            memory: (item.monit.memory / 1024 / 1024).toFixed()
          },
          status: item.pm2_env.status
        })
      }
      const createTable = table(tableArray, { border: getBorderCharacters('void'), drawHorizontalLine: () => { return false } })
      this.client.logger.debug('[PM2:List] Loaded PM2 List.')

      if (!send) return
      compressed.message.channel.send('**PM2 LIST**')
      compressed.message.channel.send(`\`\`\`js\n${createTable}\n\`\`\``)
    })
  }

  stop (compressed) {
    if (this.process === [] || this.process.length <= 0) {
      this.list(compressed, false)
      compressed.message.channel.send('❎ 프로세스 목록을 불러오는 중입니다...').then(msg => {
        if (!compressed.args.join(' ')) {
          this.client.logger.error(`[PM2:Stop] Process Name or ID is not provied! (${compressed.message.guild.id}-${compressed.message.author.id})`)
          return msg.edit('❎ **프로세스 이름** 또는 **아이디**가 제공되지 않았습니다!')
        }

        const findProcess = this.process.find(el => Number(el.id) === Number(compressed.args[0])) || this.process.find(el => String(el.name) === String(compressed.args.join(' ')))
        if (!findProcess) {
          msg.edit('❎ 해당 프로세스는 존재하지 않습니다!')
          return this.client.logger.error(`[PM2:Stop] Process is not exist! (${compressed.message.guild.id}-${compressed.message.author.id})`)
        }

        pm2Module.stop(findProcess.id)
        msg.edit(`✅ 해당 프로세스를 종료하는 중입니다... (\`${findProcess.id}-${findProcess.name}\`)`)
      })
    } else {
      if (!compressed.args.join(' ')) {
        this.client.logger.error(`[PM2:Stop] Process Name or ID is not provied! (${compressed.message.guild.id}-${compressed.message.author.id})`)
        return compressed.message.channel.send('❎ **프로세스 이름** 또는 **아이디**가 제공되지 않았습니다!')
      }

      const findProcess = this.process.find(el => Number(el.id) === Number(compressed.args[0])) || this.process.find(el => String(el.name) === String(compressed.args.join(' ')))
      if (!findProcess) {
        this.client.logger.error(`[PM2:Stop] Process is not exist! (${compressed.message.guild.id}-${compressed.message.author.id})`)
        return compressed.message.channel.send('❎ 해당 프로세스는 존재 하지 않습니다!')
      }

      pm2Module.stop(findProcess.id)
      compressed.message.channel.send(`✅ 해당 프로세르르 종료하는 중입니다... (\`${findProcess.id}-${findProcess.name}\`)`)
    }
  }

  restart (compressed) {
    if (this.process === [] || this.process.length <= 0) {
      this.list(compressed, false)
      compressed.message.channel.send('❎ 프로세스 목록을 불러오는 중입니다...').then(msg => {
        if (!compressed.args.join(' ')) {
          this.client.logger.error(`[PM2:Restart] Process Name or ID is not provied! (${compressed.message.guild.id}-${compressed.message.author.id})`)
          return msg.edit('❎ **프로세스 이름** 또는 **아이디**가 제공되지 않았습니다!')
        }

        const findProcess = this.process.find(el => Number(el.id) === Number(compressed.args[0])) || this.process.find(el => String(el.name) === String(compressed.args.join(' ')))
        if (!findProcess) {
          this.client.logger.error(`[PM2:Restart] Process is not exist! (${compressed.message.guild.id}-${compressed.message.author.id})`)
          return msg.edit('❎ 해당 프로세스는 존재 하지 않습니다!')
        }

        pm2Module.restart(findProcess.id)
        msg.edit(`✅ 해당 프로세스를 재시작 하는 중입니다... (\`${findProcess.id}-${findProcess.name}\`)`)
      })
    } else {
      if (!compressed.args.join(' ')) {
        this.client.logger.error(`[PM2:Restart] Process Name or ID is not provied! (${compressed.message.guild.id}-${compressed.message.author.id})`)
        return compressed.message.channel.send('❎ **프로세스 이름** 또는 **아이디**가 제공되지 않았습니다!')
      }

      const findProcess = this.process.find(el => Number(el.id) === Number(compressed.args[0])) || this.process.find(el => String(el.name) === String(compressed.args.join(' ')))
      if (!findProcess) {
        this.client.logger.error(`[PM2:Restart] Process is not exist! (${compressed.message.guild.id}-${compressed.message.author.id})`)
        return compressed.message.channel.send('❎ 해당 프로세스는 존재 하지 않습니다!')
      }

      pm2Module.restart(findProcess.id)
      compressed.message.channel.send(`✅ 해당 프로세스를 재시작 하는 중입니다... (\`${findProcess.id}-${findProcess.name}\`)`)
    }
  }
}

module.exports = PM2
