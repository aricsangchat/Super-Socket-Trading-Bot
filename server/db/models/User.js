const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: { unique: true }
  },
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  settings: {
    type: Array,
  }
})

UserSchema.methods.verifyPassword = function verifyPassword (password) {
  return bcrypt
    .compare(password, this.password)
    .then(res => res)
    .catch(err => err)
}

UserSchema.plugin(findOrCreate)

const User = mongoose.model('User', UserSchema)

module.exports = User
