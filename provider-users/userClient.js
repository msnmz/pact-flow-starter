const request = require('superagent')
const { User } = require('./user')

const fetchUsers = () => {
  return request.get(`http://localhost:${process.env.API_PORT}/users`).then(
    res => {
      return res.body.reduce((acc, o) => {
        acc.push(new User(o.id, o.name, o.surname, o.age))
        return acc
      }, [])
    },
    err => {
      throw new Error(`Error from response: ${err.body}`)
    }
  )
}

const fetchUserById = (userId) => {
  return request.get(`http://localhost:${process.env.API_PORT}/users/${userId}`).then(
    res => {
      const {id, name, surname, age, error} = res.body;

      if (error) return {error}

      return new User(id, name, surname, age)
    }
  )
}


module.exports = {
  fetchUsers,
  fetchUserById
}
