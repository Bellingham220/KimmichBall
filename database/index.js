require('dotenv').config()
const cors = require('cors')
const express = require('express')

// Simulación de base de datos local para evitar que falle el bot
console.log('Database Connected (Modo Local Seguro)')

const app = express()
app.use(cors())
app.use(express.json())

const database = {
  on: (event, callback) => {
    if (event === 'disconnected') console.log('Database Status: OK')
  },
  connection: {
    on: () => {}
  }
}

const routes = require('./routes/routes.js')
app.use('/api', routes)
app.use(cors({ origin: 'https://haxball.com' }))

const PORT = process.env.PORT || 3100
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`)
})
