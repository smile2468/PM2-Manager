module.exports = (text) => {
  return typeof text === 'string' ? text.replace(/`/gi, '`' + String.fromCharCode(8203)).replace(/@/gi, '@' + String.fromCharCode(8203)) : text
}
