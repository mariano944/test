# MVP — Piattaforma calcio

## Obiettivo

Realizzare una webapp in italiano, facile da usare su telefono e desktop, che permetta di seguire partite, consultare risultati e statistiche essenziali e leggere notizie collegate con fonte e orario visibili.

## Utenti e prima release

La prima release è pensata per appassionati che vogliono trovare rapidamente:

- le partite di oggi e quelle in corso;
- risultati, calendario e classifiche;
- informazioni essenziali su squadre e partite;
- notizie recenti provenienti da fonti identificabili.

## Campionati prioritari

La prima selezione geografica richiesta è:

- Italia — Serie A
- Spagna — La Liga
- Inghilterra — Premier League
- Francia — Ligue 1
- Germania — Bundesliga
- Portogallo — Primeira Liga
- Belgio — Jupiler Pro League
- Paesi Bassi — Eredivisie

L’estensione iniziale punta alle massime divisioni; coppe, seconde divisioni e competizioni europee potranno essere aggiunte in seguito.

La prima release non richiede account. Preferiti e notifiche saranno valutati dopo il rilascio iniziale.

## Schermate

### 1. Home — Oggi

- Data selezionabile e riepilogo delle partite del giorno.
- Sezioni distinguibili: In corso, Prossime, Terminate.
- Ogni riga partita mostra competizione, orario/stato, squadre e risultato quando disponibile.
- Filtro per competizione e ricerca squadra.
- Collegamento alle notizie recenti.

### 2. Partita

- Stato, competizione, data e risultato.
- Statistiche disponibili per quella partita, senza mostrare campi vuoti come se fossero zero.
- Forma recente e precedenti tra le squadre, quando forniti dalla fonte.
- Notizie correlate con fonte, data/ora e collegamento all’articolo originale.

### 3. Competizione

- Classifica e calendario/risultati.
- Filtro per stagione, se il provider lo supporta.

### 4. Squadra

- Nome, competizione e prossima partita.
- Forma recente, risultati passati e partite future.
- Statistiche aggregate essenziali se disponibili.

### 5. Notizie

- Elenco cronologico di aggiornamenti calcistici collegati a squadre o partite.
- Ogni elemento mostra fonte, timestamp e link alla fonte originale.
- Nella prima release si pubblicano titolo, breve estratto e metadati consentiti; non si copiano articoli completi senza licenza.

## Funzioni incluse

- Navigazione mobile-first e interfaccia in italiano.
- Consultazione di partite live, prossime e terminate, secondo frequenza e copertura del provider scelto.
- Risultati, calendario e classifiche.
- Pagine partita e squadra con storico essenziale.
- Feed notizie con attribuzione chiara e link alla fonte.
- Indicazione dell’ultimo aggiornamento e gestione comprensibile dei dati non disponibili.
- Backend che interroga i provider e il database; nessuna chiave API o credenziale MySQL nel browser.

## Fuori dal primo rilascio

- Registrazione e profili utente.
- Preferiti sincronizzati e notifiche push.
- Commenti, community e contenuti generati dagli utenti.
- Quote e pronostici.
- Copertura di tutti i campionati mondiali: si parte dai campionati coperti dal provider selezionato e si amplia in seguito.
- Copia integrale di articoli protetti da copyright.

## Dati e licenze — decisione aperta

Prima di integrare dati reali occorre confrontare provider e fonti verificando:

- campionati e stagioni coperti;
- aggiornamento live e ritardo dichiarato;
- disponibilità di calendario, risultati, classifiche, statistiche e storico;
- costi, quote di richieste e condizioni per uso pubblico/commerciale;
- diritti di visualizzazione, caching e attribuzione;
- disponibilità di feed o API per notizie e relativi diritti di ripubblicazione.

Non si presuppone che il piano gratuito di un provider permetta la pubblicazione pubblica dell’intero dataset.

### Valutazione preliminare delle opzioni gratuite (21 ottobre 2026)

- **football-data.org**: il piano gratuito copre sette degli otto campionati prioritari (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Primeira Liga ed Eredivisie), con risultati e calendari ritardati e classifiche; non risulta inclusa la Jupiler Pro League belga nel gruppo Free. È il candidato più semplice per un prototipo dei sette campionati coperti, ma prima della pubblicazione vanno confermati i diritti di visualizzazione e le condizioni correnti. Non promettere aggiornamenti live.
- **API-Football**: il listino pubblica un piano da 0 dollari con 100 richieste al giorno e endpoint per live score, partite, classifiche, statistiche e H2H; il piano gratuito ha limiti sulle stagioni e la copertura va verificata per ogni lega. I termini precisano che il provider non concede diritti di pubblicazione dei dati e che l’utente deve ottenere le autorizzazioni necessarie dai titolari dei diritti. È quindi adatto a una prova tecnica, non è approvato automaticamente per un sito pubblico.
- **Notizie**: NewsAPI offre un piano gratuito solo per sviluppo/test e vieta l’uso in produzione; GNews limita il piano gratuito a uso personale/non commerciale e riporta un ritardo di 12 ore. Nessuno dei due soddisfa da solo il requisito di notizie live gratis in una webapp pubblica. Per un MVP senza budget si può valutare un feed di link a notizie pubblicate dai canali ufficiali di club e competizioni, mostrando solo i metadati permessi e collegando sempre l’articolo originale. Le condizioni d’uso della singola fonte vanno controllate prima di importare o ripubblicare titoli, estratti o immagini.

**Impostazione proposta per il prototipo**: provare football-data.org sui sette campionati disponibili; verificare la copertura belga e le condizioni con il provider prima di decidere se includere API-Football in produzione. Tenere il modulo notizie separato e iniziare con link/metadata provenienti da fonti ufficiali autorizzate. Se le condizioni non consentono il riuso, la sezione può mostrare link curati senza importazione automatica.

Questa valutazione è preliminare: prezzi, copertura e termini dei fornitori possono cambiare e vanno ricontrollati prima di ogni rilascio.

Fonti ufficiali consultate:

- [football-data.org — copertura](https://www.football-data.org/coverage) e [prezzi](https://www.football-data.org/pricing)
- [API-Football — prezzi](https://www.api-football.com/pricing), [copertura](https://www.api-football.com/coverage) e [termini](https://www.api-football.com/terms)
- [NewsAPI — prezzi](https://newsapi.org/pricing) e [termini](https://newsapi.org/terms)
- [GNews — FAQ](https://gnews.io/faq) e [termini](https://gnews.io/legal/terms-of-service)

## Direzione visiva

- Look **ultra tecnologico e cinematografico**, con identità originale da centrale live calcistica.
- Base scura grafite/ossidiana, superfici stratificate e traslucide, accenti elettrici ciano e lime; colore di squadra/competizione usato con misura.
- Tipografia numerica forte per risultati e timer; gerarchia chiara per rendere punteggio, stato e prossimo evento leggibili in pochi secondi.
- Animazioni brevi per transizioni, aggiornamenti live e microinterazioni; effetti più vistosi riservati a momenti di enfasi, senza rallentare la consultazione.
- Contrasto accessibile, layout mobile-first, controlli grandi e supporto a `prefers-reduced-motion`.
- Evitare loghi, stemmi, fotografie o marchi senza diritti. Usare elementi grafici originali e dati testuali autorizzati.

## Architettura iniziale proposta

- Frontend web responsive.
- Backend/API con segreti e credenziali conservati lato server.
- MySQL HeatWave Always Free esistente per cache applicativa e dati necessari allo storico.
- Backend ospitato in OCI e collegato al DB tramite endpoint privato nella VCN, dopo verifica delle regole di rete.
- Importazione/aggiornamento programmato e cache per ridurre chiamate ai provider.

Il repository GitHub `mariano944/test` è vuoto e non contiene codice da preservare. Prima del deploy va individuata o creata una Compute Instance compatibile con il piano disponibile e collegata in sicurezza alla VCN.

## Criteri di completamento MVP

- Un utente può trovare una partita per data, competizione o squadra.
- Può aprire la partita e consultare i dati disponibili e il relativo timestamp.
- Può aprire una competizione e consultare classifica, calendario e risultati supportati.
- Può consultare notizie con fonte e link originale.
- Le pagine funzionano su mobile e desktop e mostrano stati chiari per caricamento, assenza dati ed errore del provider.
- Le credenziali restano sul backend e la porta MySQL è accessibile solo dalla rete applicativa necessaria.

## Stato del lavoro

- Specifica iniziale: definita.
- Preferenze campionati e direzione visiva: definite.
- Prototipo navigabile: realizzato in `index.html`, `styles.css` e `app.js`, con dati fittizi chiaramente etichettati.
- Backend Node.js iniziale e adapter `football-data.org`: predisposti in `server.js` e `src/providers/football-data.js`; il provider si attiva solo con token locale.
- La UI usa partite e classifiche reali quando il token è configurato; le schede partita interrogano anche il dettaglio del provider per eventi e statistiche, se il piano li rende disponibili.
- Driver `mysql2`, schema iniziale per partite/classifiche, persistenza opzionale e diagnostica DB: predisposti; il collegamento reale attende credenziali locali, certificato TLS e una via di rete alla VCN.
- Fonte belga, notizie autorizzate e deploy: ancora da fare dopo la verifica delle condizioni di utilizzo.

## Decisioni ancora da prendere

1. Confermare copertura e condizioni di pubblicazione di football-data.org prima di rendere pubblici i dati.
2. Scegliere una fonte utilizzabile per la Jupiler Pro League e una soluzione lecita per il feed notizie.
3. Definire architettura e rete per collegare il backend OCI al MySQL privato; al momento non risulta presente una Compute Instance.
4. Decidere come pubblicare la webapp e collegare il repository remoto dopo aver scelto il flusso Git.

