const queryRoutes = require('./routes/queryRoutes.js');
const cors = require('cors');
const express = require('express');
const duckdb = require('duckdb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


const db = new duckdb.Database('my_database.duckdb');

const connection = db.connect();

app.use('/api/query', queryRoutes);


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});