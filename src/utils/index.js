const { jwt } = require('../config')
const jwtToken = require('jsonwebtoken')

const signToken = str => {
  return new Promise(resolve => {
    resolve(jwtToken.sign({...str}, jwt.key))
  })
}
const verifyJwt = req => {
  let token
  if (req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.access_token
  } 
  else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  
  return new Promise((resolve, reject) => {
    jwtToken.verify(token, jwt.key, (error, decoded) => {
      if (error) {
        reject('401: User is not authenticated')
      }
   
      resolve(decoded)
    })
  })
}

module.exports = { signToken, verifyJwt }
