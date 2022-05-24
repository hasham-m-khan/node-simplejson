const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const figlet = require('figlet')

const server = http.createServer((req, res) => {
  const page = url.parse(req.url).pathname;
  const params = querystring.parse(url.parse(req.url).query);

  // Get file extension & name
  let fileExt = page.includes('.') ? getExtension(page) : (page.includes('/api') ? '.json' : '.html')
  let filename = fileExt == '.html' ? (page === '/' ? 'index.html' : `${page.slice(1)}.html`) : page.slice(1);

  // Set the Content-Type
  let contentTypes = { 
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpg',
    'avif': 'image/avif'
  }
  let contentType = contentTypes[fileExt.slice(1)]

  // Read file and respond with content
  if (!page.includes('/api')) {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        // If file not found - send 404
        figlet('404!!', function(err, content) {
          if (err) {
              console.log('Something went wrong...');
              console.dir(err);
              return;
          }
          sendResponse(res, content, 'text/plain')
        });
      } else {
        sendResponse(res, data, contentType)
      }
    })
  } else {
    let person = new Person('unknown', 'unknown', 'unknown')
    if (params['student'] == 'leon') {
      person = new Person('leon', 'Boss Man', 'Baller')
    }
    sendResponse(res, person, contentType, true)
  }
})

server.listen(8000, () => console.log('Server running on port 8000'))

function Person (name, status, currentOccupation) {
  return { name, status, currentOccupation };
}

function sendResponse (res, data, contentType, isJson = false) {
  res.writeHead(200, {  'Content-Type': contentType })
  res.end(isJson ? JSON.stringify(data) : data)
}

let getExtension = str => str.substring(str.lastIndexOf('.'), str.length)
