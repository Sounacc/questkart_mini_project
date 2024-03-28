const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Assuming globalPoolConfig is set securely
let globalPoolConfig = {};
let pool = new Pool(globalPoolConfig); // Initially create a pool with empty configuration

app.post('/connection', async (req, res) => {
  const { user, host, database, password, port } = req.body;
  let errors = {};
  
  if (!user) errors.user = true;
  if (!host) errors.host = true;
  if (!database) errors.database = true;
  if (!password) errors.password = true;
  if (!port) errors.port = true;

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  globalPoolConfig = {
    user,
    host,
    database,
    password,
    port: parseInt(port, 10),
  };

  // Recreate the pool with the new configuration.
  // Note: In a real-world application, consider the implications of recreating the pool.
  // You may need a more sophisticated approach to manage the pool lifecycle.
  pool = new Pool(globalPoolConfig);

  try {
    const { rows } = await pool.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema') AND schema_name NOT LIKE 'pg_%'");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      errors: {
        general: 'Failed to connect to the database. Please check your connection details.'
      }
    });
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

app.post('/json',async (req,res)=>{
const obj=req.body;
console.log(obj);
const leftColumns = obj.operations.join.left_columns;
  const rightColumns = obj.operations.join.right_columns;

  console.log('Left Columns:', leftColumns);
  console.log('Right Columns:', rightColumns);

  const { spawn } = require('child_process');
  const loc="C:/Users/sahil/Desktop/questkart/"

// Define the command and arguments
const command = 'python';
// jsonData=JSON.stringify({'source1': 'C:/Users/acer/Desktop/questkart/joins/obj.source_left.source.location',
    //                     "source2": 'C:/Users/acer/Desktop/questkart/joins/obj.source_right.source.location',...// if you want to use it with orginal code then replace source 1 and source 2 with this code 

    const jsonData = JSON.stringify({
      sources: {
        source_01: {
          source_type: obj.source_left.source.source_type === "files" ? "csv" : obj.source_left.source.source_type,
          location: loc+obj.source_left.source.location,
          host: obj.source_left.source.host, // Directly under source_left.source
          user: obj.source_left.source.user, // Directly under source_left.source
          port: obj.source_left.source.port, // Directly under source_left.source
          password: obj.source_left.source.password, // Directly under source_left.source
          database: obj.source_left.source.database, // Directly under source_left.source
          schema: obj.source_left.source.schema, // Directly under source_left.source
          table_query: obj.source_left.source.table_query // Directly under source_left.source, but seems to be null in your JSON
      },
      source_02: {
          source_type: obj.source_right.source.source_type === "files" ? "csv" : obj.source_right.source.source_type,
          location:loc+obj.source_right.source.location,
          host: obj.source_right.source.host, // Directly under source_right.source
          user: obj.source_right.source.user, // Directly under source_right.source
          port: obj.source_right.source.port, // Directly under source_right.source
          password: obj.source_right.source.password, // Directly under source_right.source
          database: obj.source_right.source.database, // Directly under source_right.source
          schema: obj.source_right.source.schema, // Directly under source_right.source
          table_query: obj.source_right.source.table_query // Directly under source_right.source, but seems to be null in your JSON
      }
      },
      operations: {
        join_01: {
          join_type: obj.operations.join.join_type.toLowerCase(),
          left_source: obj.source_left.source.source_type === "files" ? obj.source_left.source.location : obj.source_left.source.table_query,
          right_source: obj.source_right.source.source_type === "files" ? obj.source_right.source.location : obj.source_right.source.table_query,
          left_columns: obj.operations.join.left_columns[0].split(' ')[0], // Assuming left_columns is properly defined in your actual object
          right_columns: obj.operations.join.right_columns[0].split(' ')[0] // Assuming right_columns is properly defined in your actual object
      }
      },
      destination: {
        destination_type: obj.operations.destination.destination_type.split(' ')[0].toLowerCase(),
        user:obj.operations.destination.user,
        host:obj.operations.destination.host,
        database:obj.operations.destination.database,
        password:obj.operations.destination.password,
        port:obj.operations.destination.port,
        schema:obj.operations.destination.schema,
        table_query:obj.operations.destination.table_query,
        location: "C:/Users/sahil/Desktop/questkart/merged_data_1.csv"
      }
    });
    

console.log(jsonData);

// Adjust the path to the Python script according to its location.
// Here, it's assumed that your_script.js is located in the node_script folder,
// and you want to access scripts.py located in the python_script folder.
const scriptPath = 'C:/Users/sahil/Desktop/Project 1/Transformations_Backend-main/script.py';

  // Spawn the Python process
  const pythonProcess = spawn(command, [scriptPath, jsonData]);

  let scriptOutput = '';
  let scriptError = '';

  pythonProcess.stdout.on('data', (data) => {
    scriptOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    scriptError += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Script output:', scriptOutput);
      res.send(scriptOutput); // On successful execution, send script output back to client
    } else {
      console.error('Script error:', scriptError);
      res.status(500).send({ error: scriptError }); // On error, send the error message back to client
    }
  });

  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
