# Matchday — prototipo

Prototipo statico e navigabile della piattaforma calcistica. L'interfaccia è in italiano e adotta una direzione scura, tecnologica e cinematografica, con layout responsive.

## Avvio

Richiede Node.js 16 o successivo. Da PowerShell nella cartella del progetto:

```powershell
Copy-Item .env.example .env
npm start
```

Aprire `http://127.0.0.1:3000`. Non sono richieste dipendenze npm esterne. Senza token il backend resta in modalità demo.

Per abilitare l’API per i sette campionati coperti dal piano gratuito iniziale:

1. Crea un account su [football-data.org](https://www.football-data.org/client/register) e controlla i termini del piano e della pubblicazione prima di esporre il sito ad altri utenti.
2. Copia il token nel file `.env`, sulla riga `FOOTBALL_DATA_TOKEN=...`.
3. Riavvia il server.

Il token è un segreto: non incollarlo in chat, non inserirlo nei file frontend e non aggiungere `.env` a Git. L’endpoint `GET /api/health` indica se il server ha un token; `GET /api/competitions` elenca le competizioni inizialmente supportate; `GET /api/matches?date=YYYY-MM-DD` restituisce le partite; `GET /api/matches/{id}` restituisce il dettaglio della partita quando disponibile; `GET /api/standings?competition=SA` restituisce la classifica. Gli endpoint partita/classifica rifiutano richieste se il token non è configurato.

## Interazioni incluse

- filtri per campionato e stato della partita;
- ricerca per squadra o campionato;
- navigazione demo tra i giorni;
- menu mobile e pannello di ricerca;
- schede partita apribili, con eventi e statistiche quando forniti dal provider;
- backend Node.js senza dipendenze di terze parti, con cache breve e adapter per football-data.org.
- quando il token è valido, partite e classifiche vengono richieste al backend e mostrate con avviso di aggiornamento ritardato;
- dettagli partita accessibili anche da tastiera, con marcatori e statistiche condizionali.

## Dati

Senza token, punteggi, orari, classifiche e notizie sono inventati e servono solo a presentare il layout. Con token valido, partite del giorno e classifica Serie A provengono dal backend football-data.org; i risultati gratuiti possono essere ritardati. Le news restano dimostrative. MySQL e storico non sono ancora integrati.

Prima di collegare fonti reali vanno verificati copertura, quote, licenze e condizioni di pubblicazione. Le credenziali dovranno essere conservate nel backend, mai nel browser.

