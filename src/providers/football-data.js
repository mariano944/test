import https from 'node:https';

const API_BASE = 'https://api.football-data.org/v4';

export const FREE_COMPETITIONS = [
  { code: 'SA', name: 'Serie A', country: 'Italia', flag: '🇮🇹' },
  { code: 'PD', name: 'La Liga', country: 'Spagna', flag: '🇪🇸' },
  { code: 'PL', name: 'Premier League', country: 'Inghilterra', flag: '🏴' },
  { code: 'FL1', name: 'Ligue 1', country: 'Francia', flag: '🇫🇷' },
  { code: 'BL1', name: 'Bundesliga', country: 'Germania', flag: '🇩🇪' },
  { code: 'PPL', name: 'Primeira Liga', country: 'Portogallo', flag: '🇵🇹' },
  { code: 'DED', name: 'Eredivisie', country: 'Paesi Bassi', flag: '🇳🇱' },
];

const CACHE_TTL_MS = 60_000;

export class FootballDataProvider {
  #token;
  #cache = new Map();

  constructor({ token }) {
    this.#token = token.trim();
  }

  get configured() {
    return this.#token.length > 0;
  }

  async getMatches(date) {
    const cacheKey = `matches:${date}`;
    const raw = await this.#request(`/matches?dateFrom=${date}&dateTo=${date}`, cacheKey);
    return (raw.matches || []).filter((match) => FREE_COMPETITIONS.some((item) => item.code === match.competition?.code)).map((match) => ({
      id: match.id,
      competition: match.competition?.code || null,
      competitionName: match.competition?.name || 'Competizione',
      date: match.utcDate,
      status: match.status,
      minute: match.minute ?? null,
      home: { id: match.homeTeam?.id, name: match.homeTeam?.shortName || match.homeTeam?.name || 'Casa', crest: match.homeTeam?.crest || null },
      away: { id: match.awayTeam?.id, name: match.awayTeam?.shortName || match.awayTeam?.name || 'Trasferta', crest: match.awayTeam?.crest || null },
      score: { home: match.score?.fullTime?.home ?? null, away: match.score?.fullTime?.away ?? null },
      lastUpdated: match.lastUpdated || null,
    }));
  }

  async getStandings(competition) {
    const raw = await this.#request(`/competitions/${encodeURIComponent(competition)}/standings`, `standings:${competition}`);
    const total = (raw.standings || []).find((table) => table.type === 'TOTAL') || raw.standings?.[0];
    return (total?.table || []).map((row) => ({
      position: row.position,
      team: row.team?.shortName || row.team?.name || 'Squadra',
      played: row.playedGames,
      goalDifference: row.goalDifference,
      points: row.points,
      crest: row.team?.crest || null,
      lastUpdated: raw.lastUpdated || null,
    }));
  }

  async getMatch(id) {
    if (!/^\d+$/.test(String(id))) {
      const error = new Error('Invalid match id');
      error.status = 400;
      throw error;
    }
    const raw = await this.#request(`/matches/${encodeURIComponent(id)}`, `match:${id}`);
    const teamStats = (team) => Object.entries(team?.statistics || {}).map(([key, value]) => ({ key, value }));
    return {
      id: raw.id,
      competition: raw.competition?.name || 'Competizione',
      area: raw.area?.name || null,
      date: raw.utcDate,
      status: raw.status,
      matchday: raw.matchday ?? null,
      venue: raw.venue || null,
      lastUpdated: raw.lastUpdated || null,
      home: { name: raw.homeTeam?.shortName || raw.homeTeam?.name || 'Casa', crest: raw.homeTeam?.crest || null, formation: raw.homeTeam?.formation || null, statistics: teamStats(raw.homeTeam) },
      away: { name: raw.awayTeam?.shortName || raw.awayTeam?.name || 'Trasferta', crest: raw.awayTeam?.crest || null, formation: raw.awayTeam?.formation || null, statistics: teamStats(raw.awayTeam) },
      score: raw.score?.fullTime || { home: null, away: null },
      halfTime: raw.score?.halfTime || null,
      goals: (raw.goals || []).map((goal) => ({ minute: goal.minute, injuryTime: goal.injuryTime, team: goal.team?.name, scorer: goal.scorer?.name, assist: goal.assist?.name || null, type: goal.type })),
      bookings: (raw.bookings || []).map((booking) => ({ minute: booking.minute, team: booking.team?.name, player: booking.player?.name, card: booking.card })),
    };
  }

  async #request(resource, cacheKey) {
    const cached = this.#cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.value;

    const value = await new Promise((resolve, reject) => {
      const request = https.get(new URL(`${API_BASE}${resource}`), {
        headers: { 'X-Auth-Token': this.#token, accept: 'application/json' },
      }, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => {
          const status = Number(response.statusCode) || 502;
          if (status < 200 || status >= 300) {
            const error = new Error(`football-data.org responded with HTTP ${status}`);
            error.status = status;
            reject(error);
            return;
          }
          try { resolve(JSON.parse(body)); }
          catch { reject(new Error('football-data.org returned invalid JSON')); }
        });
      });
      request.setTimeout(12_000, () => request.destroy(new Error('Provider request timed out')));
      request.on('error', reject);
    });
    this.#cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  }
}

