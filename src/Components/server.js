// Import required modules
const express = require('express');
const { Pool } = require('pg');

// Create an Express application
const app = express();

// Set up a PostgreSQL connection pool
let pool;

// Middleware to establish database connection before each request
app.use((req, res, next) => {
  pool = new Pool({
    user: req.headers.user,
    host: req.headers.host,
    database: req.headers.database,
    password: req.headers.password,
    port: req.headers.port // default PostgreSQL port
  });
  next();
});

// Define a route to fetch schemas
app.get('/schemas', async (req, res) => {
  try {
    const result = await pool.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema'");
    const schemas = result.rows.map(row => row.schema_name);
    res.json(schemas);
  } catch (error) {
    console.error('Error fetching schemas:', error);
    res.status(500).send('Error fetching schemas');
  }
});

// Define a route to fetch tables for a given schema
app.get('/tables/:schema', async (req, res) => {
  const schema = req.params.schema;
  try {
    const result = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${schema}'`);
    const tables = result.rows.map(row => row.table_name);
    res.json(tables);
  } catch (error) {
    console.error(`Error fetching tables for schema ${schema}:`, error);
    res.status(500).send(`Error fetching tables for schema ${schema}`);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
