'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
  'css'  :'text/css',
  'gif'  :'image/gif',
  'htm'  :'text/html',
  'html' :'text/html',
  'ico'  :'image/x-icon',
  'jpeg' :'image/jpeg',
  'jpg'  :'image/jpeg',
  'js'   :'text/javascript',
  'json' :'application/json',
  'png'  :'image/png',
  'txt'  :'text/text',
}

const server = http.createServer((req, res) => {

  let uri = url.parse(req.url).pathname;
  let fileName = path.join(process.cwd(),unescape(uri));
  console.log('Loading ' + uri);
  let stats;

  try {
    stats = fs.lstatSync(fileName);
  } catch(e) {
    res.writeHead(404, {'Content-type': 'text/plain'});
    res.end();
    return;
  }
  
  // check if file or directory
  if (stats.isFile()) {
    let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
    res.writeHead(200, {'Content-type': mimeType});
    let fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
    
  } else if(stats.isDirectory()) {
    res.writeHead(302, {
      'Location' : 'index.html'
    });
    res.end();
    
  } else {
    res.writeHead(500, {'Content-type' : 'text/plain'});
    res.write('500 Internal Server Error');
    res.end();
  }
  
}).listen(3000);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});