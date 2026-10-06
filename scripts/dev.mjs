import './build.mjs';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import handler from '../api/consultation.js';
import instantHandler from '../api/instant.js';
const root = resolve('dist');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.replace(/\/$/, '') === '/api/consultation') return handler(req, res);
  if (url.pathname.replace(/\/$/, '') === '/api/instant') return instantHandler(req, res);
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
  const path = resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    const info = await stat(path);
    res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    res.setHeader('Accept-Ranges', 'bytes');
    let start = 0, end = info.size - 1;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
      if (start > end || start >= info.size) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${start}-${end}/${info.size}`);
    }
    res.setHeader('Content-Length', end - start + 1);
    if (req.method === 'HEAD') { res.end(); return; }
    const stream = createReadStream(path, { start, end });
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  }
  catch { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await readFile(resolve(root, '404.html'))); }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://localhost:${port}`));
