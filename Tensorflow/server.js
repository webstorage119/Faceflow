const express = require('express')
const path = require('path')
const { get } = require('request')

const app = express()
const PORT=3000; 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const browserDir = path.join(__dirname, 'browser')
app.use(express.static(browserDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './node_modules')))

app.get('/', (req, res) => res.redirect('/FaceFlowapp'))
app.get('/FaceFlowapp', (req, res) => res.sendFile(path.join(browserDir, 'home.html')))

app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})

app.listen(PORT, () => console.log('Listening on port 3000!'))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}