const bcrypt = require('bcryptjs')

function hashPassword (password) {
  return bcrypt
    .hash(password, 10)
    .then(hashedPassword => {
      return { hashedPassword }
    })
    .catch(err => {
      return { error: err }
    })
}

module.exports = { hashPassword }
