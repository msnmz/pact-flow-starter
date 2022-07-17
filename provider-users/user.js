class User {
  constructor(id, name, surname, age) {
    this.id = id
    this.name = name
    this.surname = surname
    this.age = age
  }


  toString() {
    return `User ${this.id}, Name: ${this.name} ${this.surname}, Age: ${this.age}`
  }
}

module.exports = {
  User,
}
