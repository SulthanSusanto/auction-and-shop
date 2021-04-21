import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'john',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'john Doe',
    email: 'user@user1.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'john martin',
    email: 'user@user2.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users
