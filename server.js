import axios from 'axios'
import cors from 'cors'
import express from 'express'
import logger from 'express-logger'
import morgan from 'morgan'

const app = express()

app.set('port', process.env.PORT || 2000)

// debugging
switch (app.get('env')) {
  case 'development':
    // compact, colorful dev logging
    app.use(morgan('dev'))
    break
  case 'production':
    // module 'express-logger' supports daily log rotation
    app.use(
      logger({
        path: __dirname + '/log/requests.log',
      })
    )
    break
}

// api routes
app.use('/api', cors())

app.get('/api/rates', (req, res) => {
  console.log('Path', req.search)
  const { base, currency } = req.query
  console.log('Base', base)
  const url =
    typeof base === 'undefined'
      ? 'https://api.exchangeratesapi.io/latest/'
      : `https://api.exchangeratesapi.io/latest/?base=${base.toUpperCase()}&currency=${currency.toUpperCase()}`

  axios
    .get(url)
    .then((re) => {
      res.send({ results: re.data, status: 200 })
    })
    .catch((re) => {
      res.send({ status: 404 })
    })
})

// 404
app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - Not found')
})

// 500
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.type('text/plain')
  res.status(500)
  res.send('500 - Server Error')
})

// PORT
app.listen(app.get('port'), () => {
  console.log(
    `Express started on http://localhost:${app.get(
      'port'
    )}; press Ctrl-C to terminate.`
  )
})
