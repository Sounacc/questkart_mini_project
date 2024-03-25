const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Assuming globalPoolConfig is set securely
let globalPoolConfig = {};

app.post('/connection', async (req, res) => {
  const { user, host, database, password, port } = req.body;

  globalPoolConfig = {
    user,
    host,
    database,
    password,
    port,
  };

  const pool = new Pool(globalPoolConfig);

  try {
    const { rows } = await pool.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema') AND schema_name NOT LIKE 'pg_%'");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    await pool.end();
  }
});

app.post('/tables', async (req, res) => {
  const { schema } = req.body;
  const pool = new Pool(globalPoolConfig);

  try {
    const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = $1;`;
    const { rows } = await pool.query(query, [schema]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    await pool.end();
  }
});

app.post('/columns', async (req, res) => {
  const { schema, table } = req.body;
  const pool = new Pool(globalPoolConfig);

  try {
    // Adjusted query to select both column_name and data_type
    const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position;`;
    const { rows } = await pool.query(query, [schema, table]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching columns:', err);
    res.status(500).send('Server error');
  } finally {
    await pool.end();
  }
});

app.post('/json',async (req,res)=>{
const obj=req.body;
console.log(obj);
const leftColumns = obj.operations.join.left_columns;
  const rightColumns = obj.operations.join.right_columns;

  console.log('Left Columns:', leftColumns);
  console.log('Right Columns:', rightColumns);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
