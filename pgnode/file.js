const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());


app.post('/connect-and-fetch-schemas', async (req, res) => {
  const { user, host, database, password, port } = req.body;
  const pool = new Pool({ user, host, database, password, port });

  try {
    const client = await pool.connect();
    const schemaQueryResult = await client.query("SELECT schema_name FROM information_schema.schemata;");
    client.release();
    res.json(schemaQueryResult.rows.map(row => row.schema_name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch tables based on schema
app.post('/fetch-tables', async (req, res) => {
  const { user, host, database, password, port, schema } = req.body;
  const pool = new Pool({ user, host, database, password, port });

  try {
    const client = await pool.connect();
    const tableQueryResult = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = $1;`, [schema]);
    client.release();
    res.json(tableQueryResult.rows.map(row => row.table_name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});