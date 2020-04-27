module.exports = (path) => {
  return new Promise((resolve, reject) => {
    require('glob')(path, (er, res) => {
      if (er) reject(er)
      else resolve(res)
    })
  })
}
