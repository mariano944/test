import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FootballDataProvider, FREE_COMPETITIONS } from './src/providers/football-data.js';
import { MatchdayDatabase } from './src/storage/mysql.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

async function loadLocalEnv() {
  try {
    const source = await readFile(path.join(ROOT, '.env'), 'utf8');
    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator < 1) continue;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

await loadLocalEnv();

const PORT = Number(process.env.PORT || 3000);
const provider = new FootballDataProvider({ token: process.env.FOOTBALL_DATA_TOKEN || '' });
const database = new MatchdayDatabase(process.env);
const publicFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
]);

function sendJson(response, status, data) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(JSON.stringify(data));
}

async function handleApi(url, method, response) {
  if (url.pathname === '/api/health' && method === 'GET') {
    return sendJson(response, 200, {
      ok: true,
      provider: 'football-data.org',
      configured: provider.configured,
      dataMode: provider.configured ? 'provider' : 'demo',
      refreshMode: 'delayed/free-tier',
      databaseConfigured: database.configured,
    });
  }

  if (url.pathname === '/api/db/health' && method === 'GET') {
    const status = await database.health();
    return sendJson(response, status.connected || !status.configured ? 200 : 503, status);
  }

  if (url.pathname === '/api/competitions' && method === 'GET') {
    return sendJson(response, 200, {
      provider: 'football-data.org',
      competitions: FREE_COMPETITIONS,
      note: 'La copertura del piano può cambiare. Il Belgio richiede un’altra fonte.',
    });
  }

  if (url.pathname === '/api/history' && method === 'GET') {
    const competition = url.searchParams.get('competition') || 'SA';
    if (!FREE_COMPETITIONS.some((item) => item.code === competition)) {
      return sendJson(response, 400, { error: 'unsupported_competition', message: 'Competizione non inclusa nella mappatura gratuita iniziale.' });
    }
    const status = await database.health();
    if (!status.connected) return sendJson(response, 503, { error: 'database_unavailable', message: status.message || 'Database non disponibile.' });
    const requestedLimit = Number(url.searchParams.get('limit') || 50);
    const limit = Number.isInteger(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 100)) : 50;
    const matches = await database.getHistory(competition, limit);
    return sendJson(response, 200, { competition, matches });
  }

  if (!provider.configured) {
    return sendJson(response, 503, {
      error: 'provider_not_configured',
      message: 'Imposta FOOTBALL_DATA_TOKEN nel file .env locale per caricare dati dal provider.',
    });
  }

  if (url.pathname === '/api/matches' && method === 'GET') {
    const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      return sendJson(response, 400, { error: 'invalid_date', message: 'Usa una data nel formato YYYY-MM-DD.' });
    }
    const matches = await provider.getMatches(date);
    if (database.readyToConnect && matches.length) {
      try { await database.saveMatches(matches); }
      catch (error) { console.error(`[matchday] database match save failed: ${error.code || 'database_error'}`); }
    }
    return sendJson(response, 200, { date, delayed: true, matches });
  }

  const matchDetail = url.pathname.match(/^\/api\/matches\/(\d+)$/);
  if (matchDetail && method === 'GET') {
    const match = await provider.getMatch(matchDetail[1]);
    return sendJson(response, 200, { delayed: true, match });
  }

  if (url.pathname === '/api/standings' && method === 'GET') {
    const competition = url.searchParams.get('competition') || 'SA';
    if (!FREE_COMPETITIONS.some((item) => item.code === competition)) {
      return sendJson(response, 400, { error: 'unsupported_competition', message: 'Competizione non inclusa nella mappatura gratuita iniziale.' });
    }
    const standings = await provider.getStandings(competition);
    if (database.readyToConnect && standings.length) {
      try { await database.saveStandings(competition, standings); }
      catch (error) { console.error(`[matchday] database standings save failed: ${error.code || 'database_error'}`); }
    }
    return sendJson(response, 200, { competition, standings, delayed: true });
  }

  return sendJson(response, 404, { error: 'not_found' });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      await handleApi(url, request.method, response);
      return;
    }

    const file = publicFiles.get(url.pathname);
    if (!file || request.method !== 'GET') {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    const [filename, contentType] = file;
    const content = await readFile(path.join(ROOT, filename));
    response.writeHead(200, {
      'content-type': contentType,
      'cache-control': 'no-cache',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' https://api.football-data.org",
      'referrer-policy': 'strict-origin-when-cross-origin',
    });
    response.end(content);
  } catch (error) {
    const status = Number(error.status) || 502;
    const authFailure = status === 401 || status === 403;
    const rateLimited = status === 429;
    console.error(`[matchday] provider request failed: ${error.name || 'Error'}; status=${status}; detail=${error.message || 'no details'}`);
    sendJson(response, status, {
      error: rateLimited ? 'provider_rate_limited' : authFailure ? 'provider_access_error' : 'provider_error',
      message: rateLimited
        ? 'Limite richieste provider raggiunto. Riprova più tardi.'
        : authFailure
          ? 'Il provider ha rifiutato la chiave o questa risorsa non è inclusa nel piano.'
          : 'Il provider non è al momento raggiungibile.',
    });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Matchday disponibile su http://127.0.0.1:${PORT}`);
  console.log(`Provider sportivo: ${provider.configured ? 'token configurato' : 'modalità demo; token non configurato'}`);
});

