"use strict";

const http = require('http');
const path = require('path');
const {URL} = require('url');
const fs = require('fs');
const child_process = require('child_process');

const dir = __dirname;

let base;

const mimeTypes = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.txt': 'text/plain',
}

function scenesDir(game) {
  const safe = (game || 'mygame').replace(/[^a-zA-Z0-9_-]/g, '');
  return path.join(dir, 'web', safe, 'scenes');
}

function sendJson(response, statusCode, data) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.end(JSON.stringify(data));
}

function handleApi(request, response, requestPath, requestUrl) {
  response.setHeader('Access-Control-Allow-Origin', '*');

  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.end();
    return;
  }

  const SCENES_DIR = scenesDir(requestUrl.searchParams.get('game'));

  if (request.method === 'GET' && requestPath === '/api/scenes') {
    try {
      const files = fs.readdirSync(SCENES_DIR)
        .filter(f => f.endsWith('.txt'))
        .map(f => f.slice(0, -4))
        .sort();
      sendJson(response, 200, files);
    } catch (e) {
      sendJson(response, 500, {error: e.message});
    }
    return;
  }

  const sceneMatch = requestPath.match(/^\/api\/scene\/([\w-]+)$/);
  if (sceneMatch) {
    const name = sceneMatch[1];
    const filePath = path.join(SCENES_DIR, name + '.txt');

    if (request.method === 'GET') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        sendJson(response, 200, {content});
      } catch (e) {
        sendJson(response, e.code === 'ENOENT' ? 404 : 500, {error: e.message});
      }
      return;
    }

    if (request.method === 'POST') {
      let body = '';
      request.on('data', chunk => { body += chunk; });
      request.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (typeof parsed.content !== 'string') throw new Error('content must be a string');
          fs.writeFileSync(filePath, parsed.content, 'utf8');
          sendJson(response, 200, {ok: true});
        } catch (e) {
          sendJson(response, 500, {error: e.message});
        }
      });
      return;
    }
  }

  if (request.method === 'POST' && requestPath === '/api/explode') {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => {
      try {
        const {content} = JSON.parse(body);
        if (typeof content !== 'string') throw new Error('content must be a string');
        const written = explodeScene(content, SCENES_DIR);
        sendJson(response, 200, {written});
      } catch (e) {
        sendJson(response, 500, {error: e.message});
      }
    });
    return;
  }

  sendJson(response, 404, {error: 'Not found'});
}

// Extract all depth-1 container sections from a unified file into individual scene .txt files.
// Each section named "X" is written to targetDir/X.txt with the marker line stripped.
// Returns the list of scene names written.
function explodeScene(content, targetDir) {
  const CONTAINER_RE = /^\*comment\s+(=+)\s*(.+)/i;
  const lines = content.split('\n');
  const written = [];

  // Collect depth-1 markers
  const markers = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(CONTAINER_RE);
    if (m && m[1].length === 1) {
      markers.push({lineIdx: i, name: m[2].trim().toLowerCase()});
    }
  }

  if (markers.length === 0) return written;

  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    const endLine = i + 1 < markers.length ? markers[i + 1].lineIdx - 1 : lines.length - 1;
    const sectionLines = lines.slice(marker.lineIdx + 1, endLine + 1);
    fs.writeFileSync(path.join(targetDir, marker.name + '.txt'), sectionLines.join('\n'), 'utf8');
    written.push(marker.name);
  }

  return written;
}

const requestHandler = (request, response) => {
  const requestUrl = new URL(request.url, base);
  const requestPath = requestUrl.pathname;

  if (requestPath.startsWith('/api/')) {
    handleApi(request, response, requestPath, requestUrl);
    return;
  }
  let requestFile = path.normalize(`${dir}/${requestPath}`);
  if (!requestFile.startsWith(dir)) {
    response.statusCode = 400;
    response.end();
    return;
  } else if (requestFile.endsWith(path.sep)) {
    requestFile += 'index.html';
  } else if (requestFile.endsWith('mygame.js')) {
    const gameDir = path.basename(path.dirname(requestFile));
    try {
      const mygame = child_process.execSync(`node mygamegenerator.js ${gameDir}`, {encoding: 'utf8'});
      fs.writeFileSync(`${dir}/web/${gameDir}/mygame.js`, mygame, 'utf8');
    } catch (e) {
      response.statusCode = 500;
      response.end('mygame.js generation failed: ' + e.message);
      return;
    }
  }
  const stream = fs.createReadStream(requestFile);
  const streamError = e => {
    if (e.code === 'ENOENT') {
      response.statusCode = 404;
      response.end('File not found');
    } else if (e.code === 'EISDIR') {
      response.statusCode = 301;
      response.setHeader('Location', requestUrl.pathname + '/');
      response.end();
    } else {
      response.statusCode = 500;
      response.end('Error loading file');
      console.log(e);
    }
  };
  stream.on('error', streamError);
  const mimeType = mimeTypes[path.extname(requestFile).toLowerCase()];
  if (mimeType) {
    response.setHeader('Content-Type', mimeType);
  }
  response.setHeader('Cache-Control', 'max-age=0');
  stream.pipe(response);
}

const server = http.createServer(requestHandler);

function openUrl(url) {
  switch(process.platform) {
    case "win32": {
      child_process.execFile('cmd', ['/c', 'start', '""', url.replace(/&/g, "^&")]);
      break;
    }
    case "darwin": {
      child_process.execFile('open', [url]);
      break;
    }
  }
}

const openEditor = process.argv.includes('--editor');

server.listen({port: 0, host:'127.0.0.1'}, (err) => {
  base = `http://localhost:${server.address().port}`;
  console.log(`server is ready: ${base}`);
  console.log(`Press Ctrl-C or close this window to stop the server`);
  openUrl(openEditor ? `${base}/editor/` : base);
})