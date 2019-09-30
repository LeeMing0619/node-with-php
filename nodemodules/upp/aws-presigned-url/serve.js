const spawn = require('child_process').spawn
const path = require('path')
const fs = require('fs')
const createWriteStream = require('fs-write-stream-atomic')
const browserify = require('browserify')
const watchify = require('watchify')
const aliasify = require('aliasify')
const babelify = require('babelify')

const port = process.env.PORT || 8080

const b = browserify({
  cache: {},
  packageCache: {},
  debug: true,
  entries: path.join(__dirname, './main.js')
})

b.plugin(watchify)

b.transform(babelify)
b.transform(aliasify, {
  aliases: {
    '@uppy': path.join(__dirname, '../../packages/@uppy')
  }
})

function bundle () {
  return b.bundle((err, data) => {
    if (err) console.error(err.stack)
    else console.log('bundle complete')
  }).pipe(createWriteStream(path.join(__dirname, './bundle.js')))
}

b.on('log', console.log)
b.on('update', bundle)
b.on('error', console.error)

fs.createReadStream(path.join(__dirname, '../../packages/uppy/dist/uppy.min.css'))
  .pipe(fs.createWriteStream(path.join(__dirname, './uppy.min.css')))

console.log('bundling...')
bundle().on('finish', () => {
  // Start the PHP delevopment server.
  spawn('php', ['-S', `localhost:${port}`], {
    stdio: 'inherit'
  })
})
