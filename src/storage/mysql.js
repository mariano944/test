import { readFileSync } from 'node:fs';
import mysql from 'mysql2/promise';

export class MatchdayDatabase {
  #env;
  #pool;

  constructor(env = process.env) {
    this.#env = env;
  }

  get configured() {
    return ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE']
      .every((name) => Boolean(this.#env[name]?.trim()));
  }

  get readyToConnect() {
    return this.configured && Boolean(this.#env.MYSQL_SSL_CA_PATH?.trim());
  }

  async health() {
    if (!this.configured) return { configured: false, connected: false, message: 'Configura host, utente, password e database nel file .env.' };
    if (!this.#env.MYSQL_SSL_CA_PATH?.trim()) return { configured: true, connected: false, message: 'Aggiungi il certificato TLS del DB in MYSQL_SSL_CA_PATH.' };
    try {
      await this.#getPool().query('SELECT 1');
      return { configured: true, connected: true };
    } catch (error) {
      return { configured: true, connected: false, message: this.#safeError(error) };
    }
  }

  async saveMatches(matches) {
    if (!this.configured || !matches.length) return;
    const rows = matches.map((match) => [
      match.id, match.competition, match.competitionName, match.date,
      match.status, match.matchday ?? null, match.home.name, match.away.name,
      match.score.home ?? null, match.score.away ?? null,
      match.lastUpdated || null, JSON.stringify(match),
    ]);
    await this.#getPool().query(
      `INSERT INTO matches
        (id, competition_code, competition_name, kickoff_at, status, matchday,
         home_team, away_team, home_score, away_score, provider_updated_at, raw_json)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         competition_code=VALUES(competition_code), competition_name=VALUES(competition_name),
         kickoff_at=VALUES(kickoff_at), status=VALUES(status), matchday=VALUES(matchday),
         home_team=VALUES(home_team), away_team=VALUES(away_team),
         home_score=VALUES(home_score), away_score=VALUES(away_score),
         provider_updated_at=VALUES(provider_updated_at), raw_json=VALUES(raw_json), cached_at=CURRENT_TIMESTAMP`,
      [rows],
    );
  }

  async saveStandings(competition, standings) {
    if (!this.configured || !standings.length) return;
    const connection = await this.#getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute('DELETE FROM standings WHERE competition_code = ?', [competition]);
      const rows = standings.map((row) => [
        competition, row.position, row.team, row.played, row.goalDifference, row.points,
        row.lastUpdated || null, JSON.stringify(row),
      ]);
      await connection.query(
        `INSERT INTO standings
          (competition_code, position, team_name, played, goal_difference, points, provider_updated_at, raw_json)
         VALUES ?`,
        [rows],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getHistory(competition, limit = 50) {
    const [rows] = await this.#getPool().execute(
      `SELECT raw_json FROM matches
       WHERE competition_code = ? AND status IN ('FINISHED', 'AWARDED')
       ORDER BY kickoff_at DESC LIMIT ?`,
      [competition, limit],
    );
    return rows.map((row) => typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : row.raw_json);
  }

  async close() {
    if (this.#pool) await this.#pool.end();
  }

  #getPool() {
    if (!this.readyToConnect) {
      const error = new Error('Database connection is not fully configured.');
      error.code = 'DB_CONFIG_INCOMPLETE';
      throw error;
    }
    if (!this.#pool) {
      this.#pool = mysql.createPool({
        host: this.#env.MYSQL_HOST.trim(),
        port: Number(this.#env.MYSQL_PORT || 3306),
        user: this.#env.MYSQL_USER.trim(),
        password: this.#env.MYSQL_PASSWORD,
        database: this.#env.MYSQL_DATABASE.trim(),
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        charset: 'utf8mb4',
        timezone: 'Z',
        ssl: {
          ca: this.#readCa(),
          rejectUnauthorized: true,
          ...(this.#env.MYSQL_SSL_SERVERNAME?.trim() ? { servername: this.#env.MYSQL_SSL_SERVERNAME.trim() } : {}),
        },
      });
    }
    return this.#pool;
  }

  #readCa() {
    return readFileSync(this.#env.MYSQL_SSL_CA_PATH.trim());
  }

  #safeError(error) {
    if (['ETIMEDOUT', 'ECONNREFUSED', 'ENETUNREACH', 'EHOSTUNREACH'].includes(error.code)) {
      return 'Il DB non è raggiungibile. Il backend deve essere nella VCN o collegato tramite VPN/Bastion.';
    }
    if (['ER_ACCESS_DENIED_ERROR', 'ER_DBACCESS_DENIED_ERROR'].includes(error.code)) {
      return 'Il DB ha rifiutato l’utente o i permessi. Verifica le credenziali localmente.';
    }
    if (error.code === 'DB_CONFIG_INCOMPLETE') return 'Completa la configurazione del database nel file .env.';
    return 'Connessione MySQL non riuscita. Verifica TLS, nome database e rete OCI.';
  }
}


