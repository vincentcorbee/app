export default class User {
  firstname = ''
  lastname = ''
  gender = ''
  age: string | number = ''
  details: any
  password = ''

  fullName() {
    return `${this.firstname} ${this.lastname}`
  }

  constructor(firstname = '', lastname = '', gender = '', age?: number, password = '') {
    this.firstname = firstname || this.firstname
    this.lastname = lastname || this.lastname
    this.gender = gender || this.gender
    this.age = age || this.age
    this.details = {
      hobbies: 'none',
    }
    this.password = password || this.password
  }
}
