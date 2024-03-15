// Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configure PostgreSQL connection settings
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Roopa',
  port: 5432, // Default port for PostgreSQL
});

// Middleware to parse JSON bodies
app.use(express.json());


// Immediately-invoked function to query database upon server start
console.log("All the Schemas");
(async () => {
  try {
    const { rows } = await pool.query( "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog','information_schema')");;

    console.log(rows);
  } catch (err) {
    console.error(err);
  }
})();
console.log("All the Tables in Learning Schema");
(async () => {
  try {
    const { rows } = await pool.query( "SELECT table_name FROM information_schema.tables WHERE table_schema = 'Learning';");;

    console.log(rows);
  } catch (err) {
    console.error(err);
  }
})();


console.log("Columns of Q1 table");

(async () => {
  try {
    const { rows } = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'Learning' AND table_name = 'Q1'");
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
})();

// Example route: Get data from your database
app.get('/data', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT first, occ FROM "Learning"."Q1"');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
