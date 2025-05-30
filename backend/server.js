// npx nodemon backend/server.js

//import moduli
const express = require('express');
const path = require('path');
const {Client} = require('pg');
const app = express();
const session = require('express-session')


//configurazione sessione
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//connessione al db
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'MuscleLab',
  password: '1234',
  port: 5432
})
client.connect()
  .then(()=> console.log("connesso al db"))
  .catch(err=>console.log("errore di connessione al db: ",err));


//path frontend
app.use(express.static(path.join(__dirname, '..', '/public')));


//mostra home all'inizio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});
  

//registrazione
app.post('/register', async (req, res) => {
  const { nome, cognome, username, email, password, data_nascita } = req.body;

  try {
    const emailCheck = await client.query('SELECT 1 FROM utenti WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).send('Email già in uso');
    }

    const usernameCheck = await client.query('SELECT 1 FROM utenti WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).send('Username già in uso');
    }

    const query = 'INSERT INTO utenti (nome, cognome, username, email, password, data_nascita) VALUES ($1, $2, $3, $4, $5, $6)';
    await client.query(query, [nome, cognome, username, email, password, data_nascita]);

    res.send('Registrazione avvenuta con successo!');
  } catch (err) {
    console.error('✖ ERRORE REGISTRAZIONE CATTURATO:', err.message, err.stack);
    res.status(500).send('Errore nella registrazione.');
  }
});


//login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM utenti WHERE email = $1 AND password = $2';

  client.query(query, [email, password])
    .then(result => {
      if (result.rows.length > 0) {
        //salva dati utente nella sessione
        req.session.user = {
          id: result.rows[0].id,
          email: result.rows[0].email,
          username: result.rows[0].username
        };
        res.sendStatus(200);
      } else {
        res.status(401).send('Credenziali errate.');
      }
    })
    .catch(err => {
      console.error('Errore login:', err);
      res.status(500).send('Errore nel login.');
    });
});

// API dati utente
app.get('/api/user-info', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Non autenticato" });
  }

  const userId = req.session.user.id;

  try {
    //recupera info utente
    const utenteResult = await client.query(
      'SELECT id, nome, cognome, username, email, data_nascita FROM utenti WHERE id = $1',
      [userId]
    );
    //recupera allenamenti utente
    const workoutResult = await client.query(
      'SELECT nome FROM workout_salvati WHERE user_id = $1',
      [userId]
    );
    //recupera schede utente
    const schedeResult = await client.query(
      'SELECT id, nome, esercizi FROM schede WHERE user_id = $1',
      [userId]
    );

    const utente = utenteResult.rows[0];

    res.json({
      username: utente.username,
      nome: utente.nome,
      cognome: utente.cognome,
      email: utente.email,
      data_nascita: utente.data_nascita,
      workouts: workoutResult.rows.map(w => w.nome),
      schede: schedeResult.rows.map(s => ({
        id: s.id,
        nome: s.nome,
        esercizi: s.esercizi
      }))
    });
  } catch (err) {
    console.error("Errore nel recupero dati:", err);
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
});


//verifica utente loggato
app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, username: req.session.user.username });
  } else {
    res.json({ authenticated: false });
  }
});

// logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Errore durante il logout:", err);
      return res.status(500).send("Errore nel logout");
    }
    res.clearCookie('connect.sid');
    res.sendStatus(200);
  });
});

// salva workout
app.post('/api/save-workout', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Non autenticato");
  }

  const { nome } = req.body;
  const userId = req.session.user.id;

  try {
    await client.query(
      'INSERT INTO workout_salvati (user_id, nome) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, nome]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Errore salvataggio workout:", err);
    res.status(500).send("Errore nel salvataggio");
  }
});

// rimuovi workout
app.post('/api/remove-workout', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Non autenticato");
  }

  const { nome } = req.body;
  const userId = req.session.user.id;

  try {
    await client.query(
      'DELETE FROM workout_salvati WHERE user_id = $1 AND nome = $2',
      [userId, nome]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Errore rimozione workout:", err);
    res.status(500).send("Errore nella rimozione");
  }
});

// salva scheda
app.post('/api/schede', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Non autenticato");
  }

  const { nome, esercizi } = req.body;
  const userId = req.session.user.id;

  if (!nome || !Array.isArray(esercizi) || esercizi.length === 0) {
    return res.status(400).send("Dati della scheda non validi");
  }

  try {
    await client.query(
      'INSERT INTO schede (user_id, nome, esercizi) VALUES ($1, $2, $3)',
      [userId, nome, JSON.stringify(esercizi)]
    );
    res.status(201).json({ message: "Scheda salvata con successo" });
  } catch (err) {
    console.error("Errore salvataggio scheda:", err);
    res.status(500).send("Errore nel salvataggio della scheda");
  }
});

//ottieni info scheda
app.get('/api/scheda/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Non autenticato");
  }

  const schedaId = req.params.id;

  try {
    const result = await client.query(
      'SELECT nome, esercizi FROM schede WHERE id = $1 AND user_id = $2',
      [schedaId, req.session.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Scheda non trovata");
    }

    const { nome, esercizi } = result.rows[0];
    res.json({ nome, esercizi: typeof esercizi === "string" ? JSON.parse(esercizi) : esercizi });
  } catch (err) {
    console.error("Errore nel recupero della scheda:", err);
    res.status(500).send("Errore nel server");
  }
});

//elimina scheda
app.delete('/api/scheda/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Non autenticato");
  }

  const schedaId = req.params.id;
  const userId = req.session.user.id;

  try {
    const result = await client.query(
      'DELETE FROM schede WHERE id = $1 AND user_id = $2 RETURNING id',
      [schedaId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Scheda non trovata o accesso negato");
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Errore durante l'eliminazione della scheda:", err);
    res.status(500).send("Errore del server");
  }
});


//restituisci palestre in base al filtro
app.post('/api/filtra-palestre', async (req, res) => {
  //estrai filtri
  const { tipi, prezzo, servizi, orari } = req.body;

  try {
    //query base
    let query = 'SELECT * FROM palestre WHERE 1=1';

    //array parametri da passare alla query
    const params = [];

    let paramIndex = 1;

    
    if (tipi && tipi.length > 0) {
      query += ` AND tipo @> $${paramIndex}`;
      params.push(JSON.stringify(tipi));
      paramIndex++;
    }


    if (prezzo && prezzo !== 'Qualsiasi') {
      query += ` AND prezzo = $${paramIndex}`;
      params.push(prezzo);
      paramIndex++;
    }


    if (servizi && servizi.length > 0) {
      query += ` AND servizi @> $${paramIndex}`;
      params.push(JSON.stringify(servizi));
      paramIndex++;
    }

    
    if (orari && orari.length > 0) {
      query += ` AND orari @> $${paramIndex}`;
      params.push(JSON.stringify(orari));
      paramIndex++;
    }

    //esegui query
    const result = await client.query(query, params);

    //invia al client
    res.json(result.rows);
  } catch (err) {
    console.error('Errore nel filtraggio palestre:', err);
    res.status(500).json({ error: 'Errore nel filtraggio palestre' });
  }
});



// porta di ascolto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});