const bcrypt = require('bcryptjs')

const users = [
    {
        name: 'Admin',
        email: 'admin@admin.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: true
    },
    {
        name: 'Walter White',
        email: 'mrwhite@heisenberg.com',
        password: bcrypt.hashSync('123456', 10)
    }
]

module.exports = users