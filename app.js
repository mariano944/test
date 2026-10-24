const leagues = [
  { id: 'ITA', country: '🇮🇹', name: 'Serie A', countryName: 'Italia' },
  { id: 'ESP', country: '🇪🇸', name: 'La Liga', countryName: 'Spagna' },
  { id: 'ENG', country: '🏴', name: 'Premier League', countryName: 'Inghilterra' },
  { id: 'FRA', country: '🇫🇷', name: 'Ligue 1', countryName: 'Francia' },
  { id: 'GER', country: '🇩🇪', name: 'Bundesliga', countryName: 'Germania' },
  { id: 'POR', country: '🇵🇹', name: 'Primeira Liga', countryName: 'Portogallo' },
  { id: 'BEL', country: '🇧🇪', name: 'Jupiler Pro League', countryName: 'Belgio' },
  { id: 'NED', country: '🇳🇱', name: 'Eredivisie', countryName: 'Paesi Bassi' },
];

// Esempi inventati per mostrare il layout. Non sono risultati o notizie reali.
const demoMatches = [
  { league: 'ITA', home: 'Milan', away: 'Juventus', h: 2, a: 1, status: 'live', time: '67′', sub: '2° TEMPO', marks: ['M', 'J'], colors: ['#672e39', '#252f69'], minute: '67′' },
  { league: 'ENG', home: 'Arsenal', away: 'Liverpool', h: null, a: null, status: 'upcoming', time: '20:45', sub: 'TRA 32 MIN', marks: ['A', 'L'], colors: ['#7c2930', '#771f2c'], minute: 'STASERA' },
  { league: 'ESP', home: 'Barcelona', away: 'Atlético', h: 1, a: 1, status: 'finished', time: 'FT', sub: 'TERMINATA', marks: ['B', 'A'], colors: ['#572d78', '#791f2d'], minute: 'FT' },
  { league: 'GER', home: 'Bayern', away: 'Dortmund', h: null, a: null, status: 'upcoming', time: '21:00', sub: 'TRA 47 MIN', marks: ['B', 'D'], colors: ['#7c2229', '#e3c74d'], minute: 'STASERA' },
  { league: 'FRA', home: 'Paris SG', away: 'Marseille', h: 3, a: 0, status: 'finished', time: 'FT', sub: 'TERMINATA', marks: ['P', 'M'], colors: ['#283c71', '#5483a2'], minute: 'FT' },
  { league: 'POR', home: 'Benfica', away: 'Porto', h: null, a: null, status: 'upcoming', time: '21:15', sub: 'TRA 62 MIN', marks: ['B', 'P'], colors: ['#7b2329', '#253756'], minute: 'STASERA' },
  { league: 'BEL', home: 'Club Brugge', away: 'Anderlecht', h: 0, a: 0, status: 'live', time: '28′', sub: '1° TEMPO', marks: ['C', 'A'], colors: ['#2765a1', '#6b4a8f'], minute: '28′' },
  { league: 'NED', home: 'Ajax', away: 'PSV', h: null, a: null, status: 'upcoming', time: '21:00', sub: 'TRA 47 MIN', marks: ['A', 'P'], colors: ['#d24d43', '#d04348'], minute: 'STASERA' },
  { league: 'ITA', home: 'Inter', away: 'Napoli', h: 1, a: 0, status: 'live', time: '54′', sub: '2° TEMPO', marks: ['I', 'N'], colors: ['#243f83', '#233f91'], minute: '54′' },
  { league: 'ENG', home: 'Chelsea', away: 'Tottenham', h: 0, a: 2, status: 'finished', time: 'FT', sub: 'TERMINATA', marks: ['C', 'T'], colors: ['#2056a1', '#fff'], minute: 'FT' },
  { league: 'ESP', home: 'Real Madrid', away: 'Sevilla', h: null, a: null, status: 'upcoming', time: '21:30', sub: 'TRA 77 MIN', marks: ['R', 'S'], colors: ['#fff', '#c6383b'], minute: 'STASERA' },
  { league: 'GER', home: 'Leverkusen', away: 'Leipzig', h: 2, a: 2, status: 'finished', time: 'FT', sub: 'TERMINATA', marks: ['L', 'R'], colors: ['#9e2f2e', '#fff'], minute: 'FT' },
];
let matches = demoMatches;
let providerMode = false;
let providerNotice = '';
let providerStandings = null;
let selectedCompetition = 'SA';

const standings = [
  ['1', 'Inter', '8', '+14', '21', 'I', true], ['2', 'Milan', '8', '+11', '19', 'M'], ['3', 'Napoli', '8', '+9', '18', 'N'],
  ['4', 'Juventus', '8', '+7', '17', 'J'], ['5', 'Roma', '8', '+5', '15', 'R'], ['6', 'Atalanta', '8', '+3', '14', 'A'],
];
const news = [
  { source: 'MATCHDAY LAB · DEMO', title: 'La nuova generazione cambia il ritmo della stagione', time: 'ESEMPIO · 12 MIN FA', tag: 'ANALISI', style: '' },
  { source: 'MATCHDAY DESK · DEMO', title: 'Dentro la partita: tre chiavi tattiche da seguire stasera', time: 'ESEMPIO · 38 MIN FA', tag: 'FOCUS', style: 'thumb-2' },
  { source: 'MATCHDAY INSIDER · DEMO', title: 'Mercato, i nomi da tenere d’occhio nelle prossime settimane', time: 'ESEMPIO · 1 ORA FA', tag: 'MERCATO', style: 'thumb-3' },
];

let leagueFilter = 'all';
let statusFilter = 'all';
let searchFilter = '';
let selectedDay = 0;
const $ = (selector) => document.querySelector(selector);
const leagueById = (id) => leagues.find((league) => league.id === id);

function renderLeagues() {
  $('#league-nav').innerHTML = leagues.map((league) => `<a class="league-link ${league.id === leagueFilter ? 'selected' : ''}" href="#partite" data-league="${league.id}"><span class="league-flag">${league.country}</span>${league.name}<small>${providerMode && league.id === 'BEL' ? 'NO API' : league.id}</small></a>`).join('');
  $('#league-chips').innerHTML = `<button class="league-chip ${leagueFilter === 'all' ? 'active' : ''}" data-league="all">TUTTI I CAMPIONATI</button>` + leagues.map((league) => `<button class="league-chip ${league.id === leagueFilter ? 'active' : ''}" data-league="${league.id}">${league.country} ${league.name.toUpperCase()}</button>`).join('');
  document.querySelectorAll('[data-league]').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault(); leagueFilter = button.dataset.league; renderLeagues(); renderMatches();
  }));
}

function renderMatches() {
  const unavailableLeague = providerMode && leagueFilter === 'BEL';
  const visible = unavailableLeague ? [] : matches.filter((match) => (leagueFilter === 'all' || match.league === leagueFilter) && (statusFilter === 'all' || match.status === statusFilter) && `${match.home} ${match.away} ${leagueById(match.league)?.name || ''}`.toLowerCase().includes(searchFilter.toLowerCase()));
  $('#match-grid').innerHTML = visible.length ? visible.map((match) => {
    const league = leagueById(match.league);
    if (!league) return '';
    const score = match.h === null ? '<span class="pending">— : —</span>' : `${match.h} <span class="score-sep">:</span> ${match.a}`;
    const statusClass = match.status === 'live' ? 'live' : match.status === 'finished' ? 'finished' : '';
    const source = match.source === 'provider' ? 'F-DATA' : 'DEMO';
    const bottom = match.source === 'provider' ? (match.lastUpdated ? `AGG. ${new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(new Date(match.lastUpdated))} · RITARDATO` : 'AGGIORNAMENTO RITARDATO') : 'ESEMPIO · DATI FITTIZI';
    return `<article class="match-card" tabindex="0" role="button" data-match-id="${match.id || ''}" aria-label="Dettaglio ${match.source === 'provider' ? '' : 'demo '}${match.home} contro ${match.away}"><div class="match-card-head"><span class="match-league"><span class="league-flag mini">${league.country}</span>${league.name.toUpperCase()} <span class="news-demo">${source}</span></span><span class="match-status ${statusClass}">${match.time}</span></div><div class="match-body"><div class="match-side"><span class="team-crest" style="--team:${match.colors[0]}">${match.marks[0]}</span><span class="team-name">${match.home}</span></div><div class="match-score ${match.h === null ? 'pending' : ''}">${score}</div><div class="match-side away"><span class="team-name">${match.away}</span><span class="team-crest" style="--team:${match.colors[1]}">${match.marks[1]}</span></div></div><div class="match-bottom"><span>${match.sub}</span><span class="venue">${bottom}</span><span class="match-arrow">↗</span></div></article>`;
  }).join('') : `<div class="empty-state">${unavailableLeague ? 'La Jupiler Pro League non è coperta dalla fonte gratuita attuale. Serve un provider aggiuntivo per il Belgio.' : providerMode ? 'Nessuna partita disponibile nei campionati coperti per questa data.' : 'Nessuna partita demo corrisponde ai filtri selezionati.'}</div>`;
  if (!visible.length && providerNotice && !unavailableLeague) $('#match-grid').innerHTML = `<div class="empty-state">${providerNotice}</div>`;
  if (providerMode) {
    const counts = {
      all: visible.length,
      live: visible.filter((match) => match.status === 'live').length,
      upcoming: visible.filter((match) => match.status === 'upcoming').length,
      finished: visible.filter((match) => match.status === 'finished').length,
    };
    document.querySelectorAll('.match-tab').forEach((tab) => { const count = tab.querySelector('span'); if (count) count.textContent = counts[tab.dataset.status] ?? 0; });
  }
  document.querySelectorAll('.match-card').forEach((card) => {
    const open = () => card.dataset.matchId ? openMatchDetails(card.dataset.matchId) : showToast('Scheda partita dimostrativa.');
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

const statLabels = { corner_kicks: 'Calci d’angolo', free_kicks: 'Calci di punizione', goal_kicks: 'Rinvii dal fondo', offsides: 'Fuorigioco', fouls: 'Falli', ball_possession: 'Possesso palla', saves: 'Parate', throw_ins: 'Rimesse laterali', shots: 'Tiri', shots_on_goal: 'Tiri in porta', shots_off_goal: 'Tiri fuori', yellow_cards: 'Ammonizioni', yellow_red_cards: 'Doppie ammonizioni', red_cards: 'Espulsioni' };

async function openMatchDetails(id) {
  const modal = $('#match-modal'); const panel = $('#match-detail-content');
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  panel.innerHTML = '<div class="match-detail-loading"><span class="mini-live"></span> RECUPERO DATI PARTITA…</div>';
  $('#match-detail-close').focus();
  try {
    const response = await fetch(`/api/matches/${encodeURIComponent(id)}`); const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Dettaglio non disponibile.');
    const match = result.match;
    const events = [
      ...match.goals.map((goal) => ({ minute: goal.minute, injuryTime: goal.injuryTime, icon: '⚽', title: goal.scorer || 'Autore non disponibile', detail: `${goal.team || ''}${goal.assist ? ` · assist ${goal.assist}` : ''}` })),
      ...match.bookings.map((booking) => ({ minute: booking.minute, injuryTime: null, icon: booking.card === 'RED' ? '🟥' : '🟨', title: booking.player || 'Giocatore', detail: `${booking.team || ''} · ${booking.card === 'RED' ? 'espulsione' : 'ammonizione'}` })),
    ].sort((first, second) => (first.minute || 0) - (second.minute || 0));
    const eventRows = events.length ? events.map((event) => `<li><span>${escapeHtml(event.minute)}${event.injuryTime ? `+${escapeHtml(event.injuryTime)}` : ''}′</span><b>${event.icon} ${escapeHtml(event.title)}</b><small>${escapeHtml(event.detail)}</small></li>`).join('') : '<li class="detail-muted">Nessun evento disponibile</li>';
    const stats = Object.keys(statLabels).map((key) => {
      const home = match.home.statistics.find((item) => item.key === key)?.value; const away = match.away.statistics.find((item) => item.key === key)?.value;
      return home == null && away == null ? '' : `<div class="detail-stat"><span>${escapeHtml(home ?? '—')}</span><b>${statLabels[key]}</b><span>${escapeHtml(away ?? '—')}</span></div>`;
    }).filter(Boolean).join('');
    const stamp = match.lastUpdated ? `ULTIMO AGGIORNAMENTO · ${new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Rome' }).format(new Date(match.lastUpdated))}` : 'DATI DEL PROVIDER · POSSIBILE RITARDO';
    panel.innerHTML = `<div class="match-detail-kicker">${escapeHtml(match.competition)}${match.matchday ? ` · GIORNATA ${escapeHtml(match.matchday)}` : ''}</div><h2 id="match-detail-title">${escapeHtml(match.home.name)} <span>VS</span> ${escapeHtml(match.away.name)}</h2><div class="match-detail-score">${match.score.home ?? '—'} <i>:</i> ${match.score.away ?? '—'}</div><p class="match-detail-meta">${escapeHtml(new Intl.DateTimeFormat('it-IT', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Rome' }).format(new Date(match.date)))}${match.venue ? ` · ${escapeHtml(match.venue)}` : ''}</p><div class="detail-columns"><section><h3>EVENTI</h3><ul class="detail-events">${eventRows}</ul>${match.halfTime?.home != null ? `<p class="detail-muted">Intervallo ${match.halfTime.home}–${match.halfTime.away}</p>` : ''}</section><section><h3>STATISTICHE DISPONIBILI</h3>${stats || '<p class="detail-muted">Questa partita o il piano del provider non espongono statistiche dettagliate.</p>'}</section></div><div class="match-detail-source">${escapeHtml(stamp)} · FOOTBALL-DATA.ORG</div>`;
  } catch (error) { panel.innerHTML = `<div class="match-detail-loading">${escapeHtml(error.message)}<p>I dettagli dipendono dai campi e dalle quote del piano gratuito.</p></div>`; }
}

function closeMatchDetails() { $('#match-modal').classList.remove('open'); $('#match-modal').setAttribute('aria-hidden', 'true'); }

function renderStandings() {
  if (providerMode && providerStandings) {
    $('#standing-table').innerHTML = providerStandings.map((row) => `<div class="standing-row ${row.position <= 4 ? 'top-row' : ''}"><span class="position">${String(row.position).padStart(2, '0')}</span><span class="standing-team"><i>${row.team.slice(0, 1)}</i>${row.team}</span><span>${row.played}</span><span>${row.goalDifference > 0 ? '+' : ''}${row.goalDifference}</span><span class="points">${row.points}</span></div>`).join('');
    return;
  }
  $('#standing-table').innerHTML = standings.map(([position, team, games, difference, points, mark, top]) => `<div class="standing-row ${top ? 'top-row' : ''}"><span class="position">${position.padStart(2, '0')}</span><span class="standing-team"><i>${mark}</i>${team}</span><span>${games}</span><span>${difference}</span><span class="points">${points}</span></div>`).join('');
}

function renderNews() {
  $('#news-list').innerHTML = news.map((item) => `<article class="news-card"><div class="news-thumb ${item.style}"><span>${item.tag}</span></div><div class="news-copy"><span class="news-source">${item.source}</span><h3>${item.title}</h3><small>${item.time} · TESTO DIMOSTRATIVO</small></div></article>`).join('');
}

function formatDate(offset) {
  const date = new Date(); date.setDate(date.getDate() + offset);
  if (offset === 0) return `OGGI, ${new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', timeZone: 'Europe/Rome' }).format(date).replace('.', '').toUpperCase()}`;
  return new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'Europe/Rome' }).format(date).replaceAll('.', '').toUpperCase();
}

function apiDate(offset = selectedDay) {
  const date = new Date(); date.setDate(date.getDate() + offset);
  const parts = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Rome' }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function formatKickoff(dateValue) {
  return new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(new Date(dateValue));
}

const leagueColors = { SA: ['#205b78', '#96565a'], PD: ['#8b4251', '#415f86'], PL: ['#624083', '#325773'], FL1: ['#405a86', '#4b6b7b'], BL1: ['#8e4a44', '#756540'], PPL: ['#456f5c', '#3b567c'], DED: ['#9a6041', '#446b92'] };

function mapProviderMatch(item) {
  const league = leagueById({ SA: 'ITA', PD: 'ESP', PL: 'ENG', FL1: 'FRA', BL1: 'GER', PPL: 'POR', DED: 'NED' }[item.competition]);
  const live = ['LIVE', 'IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT'].includes(item.status);
  const finished = ['FINISHED', 'AWARDED'].includes(item.status);
  const status = live ? 'live' : finished ? 'finished' : 'upcoming';
  const specialStatus = { POSTPONED: 'RINVIATA', SUSPENDED: 'SOSPESA', CANCELLED: 'ANNULLATA', TIMED: 'ORARIO DA CONFERMARE' }[item.status];
  const time = live ? `${item.minute ?? 'LIVE'}${typeof item.minute === 'number' ? '′' : ''}` : specialStatus || (finished ? 'FT' : formatKickoff(item.date));
  const sub = live ? 'IN CORSO · AGGIORNAMENTO RITARDATO' : finished ? 'TERMINATA' : specialStatus ? 'STATO DEL PROVIDER' : 'CALCIO D’INIZIO';
  const colors = leagueColors[item.competition] || ['#385264', '#62506f'];
  return {
    id: item.id,
    league: league?.id,
    home: item.home.name,
    away: item.away.name,
    h: item.score.home,
    a: item.score.away,
    status,
    time,
    sub,
    marks: [item.home.name.slice(0, 1), item.away.name.slice(0, 1)],
    colors,
    source: 'provider',
    lastUpdated: item.lastUpdated,
  };
}

async function loadProviderDay() {
  $('#selected-date').textContent = formatDate(selectedDay);
  if (!providerMode) { renderMatches(); return; }
  providerNotice = 'Caricamento partite dal provider…'; renderMatches();
  try {
    const response = await fetch(`/api/matches?date=${apiDate()}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Il provider non è raggiungibile.');
    matches = result.matches.map(mapProviderMatch).filter((match) => match.league);
    providerNotice = matches.length ? '' : 'Il provider non riporta partite per questa data nei campionati disponibili.';
  } catch (error) {
    matches = [];
    providerNotice = `Dati non disponibili: ${error.message}`;
  }
  renderMatches();
  $('#match-total').textContent = String(matches.length).padStart(2, '0');
}

async function connectProvider() {
  try {
    const response = await fetch('/api/health');
    const health = await response.json();
    if (!response.ok || !health.configured) return;
    providerMode = true;
    const banner = $('#data-banner');
    banner.innerHTML = '<span>◉</span> DATI DA FOOTBALL-DATA.ORG <b>PIANO GRATUITO · AGGIORNAMENTO RITARDATO</b>';
    banner.classList.add('provider-banner');
    $('.hero-art-label.label-top').innerHTML = 'FOOTBALL-DATA.ORG <b>FREE TIER</b>';
    $('.hero-art-label.label-bottom').textContent = 'RISULTATI · CALENDARIO · CLASSIFICHE';
    $('.right-rail').innerHTML = '<div class="rail-top"><span>DATA DESK</span><span class="pulse-star">✳</span></div><div class="provider-rail-note"><div class="provider-rail-icon">◉</div><b>Fonte dati attiva</b><p>Partite e classifiche provengono da football-data.org. Il piano gratuito può mostrare risultati con ritardo.</p><span>AGGIORNAMENTO NON LIVE</span></div><div class="rail-foot"><span>FOOTBALL-DATA.ORG API</span><span>✳</span></div>';
    renderLeagues();
    await loadProviderDay();
    try {
      const standingsResponse = await fetch(`/api/standings?competition=${selectedCompetition}`);
      const standingsResult = await standingsResponse.json();
      if (standingsResponse.ok) { providerStandings = standingsResult.standings; renderStandings(); }
      else $('#standing-table').innerHTML = '<div class="empty-state">Classifica non disponibile nel piano corrente.</div>';
    } catch { $('#standing-table').innerHTML = '<div class="empty-state">Classifica temporaneamente non disponibile.</div>'; }
  } catch {
    // Se anche il controllo di salute non risponde, la pagina resta nella modalità demo.
  }
}

function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3300);
}

document.querySelectorAll('.match-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.match-tab').forEach((item) => item.classList.remove('active'));
  tab.classList.add('active'); statusFilter = tab.dataset.status; renderMatches();
}));
$('#day-prev').addEventListener('click', () => { selectedDay -= 1; if (providerMode) loadProviderDay(); else { $('#selected-date').textContent = formatDate(selectedDay); showToast('Anteprima demo: calendario dimostrativo.'); } });
$('#day-next').addEventListener('click', () => { selectedDay += 1; if (providerMode) loadProviderDay(); else { $('#selected-date').textContent = formatDate(selectedDay); showToast('Anteprima demo: calendario dimostrativo.'); } });
$('#load-more').addEventListener('click', () => showToast('Questa anteprima contiene un campione di partite dimostrative.'));
$('#filter-button').addEventListener('click', () => { leagueFilter = leagueFilter === 'all' ? 'ITA' : 'all'; renderLeagues(); renderMatches(); });
$('#standing-select').addEventListener('change', async (event) => {
  selectedCompetition = event.target.value;
  if (!providerMode) { showToast('La classifica demo è soltanto di Serie A.'); return; }
  providerStandings = null;
  $('#standing-table').innerHTML = '<div class="empty-state">Caricamento classifica…</div>';
  try {
    const response = await fetch(`/api/standings?competition=${selectedCompetition}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Classifica non disponibile.');
    providerStandings = result.standings;
    renderStandings();
  } catch (error) {
    $('#standing-table').innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
});
$('#mobile-menu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$('#search-open').addEventListener('click', () => { $('#search-modal').classList.add('open'); $('#search-modal').setAttribute('aria-hidden', 'false'); $('#global-search').focus(); });
$('#search-close').addEventListener('click', closeSearch);
$('#search-modal').addEventListener('click', (event) => { if (event.target === $('#search-modal')) closeSearch(); });
function closeSearch() { $('#search-modal').classList.remove('open'); $('#search-modal').setAttribute('aria-hidden', 'true'); }
$('#match-detail-close').addEventListener('click', closeMatchDetails);
$('#match-modal').addEventListener('click', (event) => { if (event.target === $('#match-modal')) closeMatchDetails(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && $('#match-modal').classList.contains('open')) closeMatchDetails(); });
$('#global-search').addEventListener('input', (event) => { searchFilter = event.target.value.trim(); renderMatches(); });
$('#global-search').addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSearch(); if (event.key === 'Enter') { closeSearch(); $('#partite').scrollIntoView({ behavior: 'smooth' }); } });

$('#hero-date').textContent = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' }).format(new Date()).toUpperCase();
$('#selected-date').textContent = formatDate(0);
renderLeagues(); renderMatches(); renderStandings(); renderNews(); connectProvider();

