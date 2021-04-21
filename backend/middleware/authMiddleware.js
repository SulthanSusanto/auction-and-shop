import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

export const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization
  if (authorization && authorization.startsWith('Bearer'))
    try {
      const token = authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)

      res.status(401)

      throw new Error('Not Authorized, token failed')
    }
  else {
    res.status(401)

    throw new Error('Not Authorized, no token')
  }
})

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) next()
  else {
    res.status(401)
    throw new Error('Not Authorized as an admin')
  }
}
