const queryRoutes = require('./routes/queryRoutes.js');
const cors = require('cors');
const express = require('express');
const duckdb = require('duckdb');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());


const db = new duckdb.Database('my_database.duckdb');

const connection = db.connect();

app.use('/api/query', queryRoutes);

app.get('/', (req, res) => {
    connection.all('SELECT * from users', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

//change the route to receive the query string as a parameter
//if route is just query shouldn't be url something like http://localhost:3000/query 

app.get('/query', (req, res) => {
    const query = req.query.q;
    //what does req.query.q mean?
    //it means that the query parameter is passed in the URL like this: http://localhost:3000/?q=SELECT * FROM users
    connection.run(query, (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            // if (query && query.toUpperCase().includes('INSERT')) {
            //     res.send('inserter');
            // }
            res.json(rows);
        }
    })
});
app.get('/create', (req, res) => {
    connection.all('CREATE TABLE users (name VARCHAR, age INTEGER)', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

//delete sql query
app.get('/delete', (req, res) => {
    connection.all('DELETE FROM users WHERE name = "Alicent"', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});


//create a insert query
// app.get('/insert', (req, res) => {
//     connection.all("INSERT INTO users VALUES('Alicent', 142)", (err, rows) => {
//         if (err) {
//             res.status(500).send(err.message);
//         } else {
//             res.send('Inserted');
//         }
//     });
// });
    
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});