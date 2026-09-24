import './build.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import handler from '../api/consultation.js';
const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.txt': 'text/plain' };
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.replace(/\/$/, '') === '/api/consultation') return handler(req, res);
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
  const path = resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try { res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream'); res.end(await readFile(path)); }
  catch { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await readFile(resolve(root, '404.html'))); }
}).listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log('Preview: http://localhost:3000'));
