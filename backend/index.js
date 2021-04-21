import path from 'path'
import express from 'express'
import connectDB from './config/db.js'
import colors from 'colors'
import dotenv from 'dotenv'
import server from './app/server.js'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.use(cors())

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use('/api/v1', server)

app.get('/api/v1/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on ${port}`.yellow.bold
  )
})
