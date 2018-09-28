const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cons = require('consolidate'),
dust = require('dustjs-helpers'),
{ Pool, Client } = require('pg'),
app = express();

// DB Connect String
const connectionString = "postgres://chef:letscook@localhost/recipebookdb"
const pool = new Pool({
    connectionString : connectionString
});

// Assign Dust Engine to .dust Files
app.engine('dust', cons.dust);

// Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // PG Connect
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT * FROM recipes', (err, result) => {
          done()
          if (err) {
            return console.error('Error running query', err);
          } else {
            res.render('index', {recipes: result.rows})
          }
        })
      })
})

app.post('/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)',
        [req.body.name, req.body.ingredients, req.body.directions], (err, result) => {
          done()
          if (err) {
            return console.error('Error running query', err);
          } else {
            res.redirect('/');
          }
        })
      })
})

app.delete('/delete/:id', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('DELETE FROM recipes WHERE id = $1',
        [req.params.id], (err, result) => {
          done()
          if (err) {
            return console.error('Error running query', err);
          } else {
            res.sendStatus(204);
          }
        })
      })
});

app.post('/edit', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id = $4',
        [req.body.name, req.body.ingredients, req.body.directions, req.body.id], (err, result) => {
          done()
          if (err) {
            return console.error('Error running query', err);
          } else {
            res.redirect('/');
          }
        })
      })
})

// Server
app.listen(3000, () => console.log('Server Started On Port 3000'));