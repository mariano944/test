# Matchday — prototipo

Prototipo statico e navigabile della piattaforma calcistica. L'interfaccia è in italiano e adotta una direzione scura, tecnologica e cinematografica, con layout responsive.

## Avvio

Richiede Node.js 16 o successivo. Da PowerShell nella cartella del progetto:

```powershell
Copy-Item .env.example .env
npm install
npm start
```

Aprire `http://127.0.0.1:3000`. Senza token il backend resta in modalità demo.

Per abilitare l’API per i sette campionati coperti dal piano gratuito iniziale:

1. Crea un account su [football-data.org](https://www.football-data.org/client/register) e controlla i termini del piano e della pubblicazione prima di esporre il sito ad altri utenti.
2. Copia il token nel file `.env`, sulla riga `FOOTBALL_DATA_TOKEN=...`.
3. Riavvia il server.

Il token è un segreto: non incollarlo in chat, non inserirlo nei file frontend e non aggiungere `.env` a Git. L’endpoint `GET /api/health` indica se il server ha un token; `GET /api/db/health` controlla la connessione MySQL; `GET /api/competitions` elenca le competizioni inizialmente supportate; `GET /api/matches?date=YYYY-MM-DD` restituisce le partite; `GET /api/matches/{id}` restituisce il dettaglio quando disponibile; `GET /api/standings?competition=SA` restituisce la classifica; `GET /api/history?competition=SA` legge le partite terminate salvate nel database.

## Interazioni incluse

- filtri per campionato e stato della partita;
- ricerca per squadra o campionato;
- navigazione demo tra i giorni;
- menu mobile e pannello di ricerca;
- schede partita apribili, con eventi e statistiche quando forniti dal provider;
- backend Node.js senza dipendenze di terze parti, con cache breve e adapter per football-data.org.
- quando il token è valido, partite e classifiche vengono richieste al backend e mostrate con avviso di aggiornamento ritardato;
- dettagli partita accessibili anche da tastiera, con marcatori e statistiche condizionali.
- persistenza opzionale delle partite e delle classifiche in MySQL HeatWave;
- schema SQL iniziale in `db/schema.sql` e controllo diagnostico `/api/db/health`.

## Dati

Senza token, punteggi, orari, classifiche e notizie sono inventati e servono solo a presentare il layout. Con token valido, partite e classifiche provengono dal backend football-data.org; i risultati gratuiti possono essere ritardati. Le partite e le classifiche vengono salvate in MySQL soltanto quando `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` e `MYSQL_SSL_CA_PATH` sono configurati e il backend riesce a raggiungere il DB. L’endpoint DB del tuo account è privato: il backend deve girare su una macchina collegata alla VCN, oppure usare VPN/Bastion. Per provare dal PC puoi usare una sessione port forwarding OCI Bastion verso `10.0.1.104:3306`; imposta `MYSQL_HOST=127.0.0.1` e `MYSQL_PORT` sulla porta locale del tunnel. Se richiesto dal certificato, `MYSQL_SSL_SERVERNAME` deve contenere l’FQDN interno del DB. Non rendere pubblico il DB per collegarlo dal PC.

Per configurare MySQL, esegui `db/schema.sql` una volta con un utente amministrativo del DB, poi configura un utente applicativo con i soli permessi necessari. Salva password e percorso del certificato TLS nel `.env` locale; non inviarli in chat né inserirli in Git. La sessione Bastion è temporanea e utile per sviluppo/amministrazione; per pubblicare l’app, il backend andrà eseguito su una risorsa collegata alla VCN. Nelle regole di rete consenti la porta 3306 solo dall’IP privato del Bastion o dalla subnet/NSG del backend, mai da `0.0.0.0/0`. Consulta la documentazione OCI su [come raggiungere un DB System privato](https://docs.oracle.com/en-us/iaas/mysql-database/doc/overview-connecting-db-system.html), [port forwarding con Bastion](https://docs.oracle.com/en-us/iaas/Content/Bastion/Tasks/create-session-port-forwarding.htm) e la documentazione del driver [mysql2](https://github.com/sidorares/node-mysql2).

Prima di pubblicare dati reali vanno verificati copertura, quote, licenze e condizioni di pubblicazione. Le credenziali restano nel backend, mai nel browser.


