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

const { spawn } = require('child_process');

// Define the command and arguments
const command = 'python';
// jsonData=JSON.stringify({'source1': 'C:/Users/acer/Desktop/questkart/joins/obj.source_left.source.location',
    //                     "source2": 'C:/Users/acer/Desktop/questkart/joins/obj.source_right.source.location',...// if you want to use it with orginal code then replace source 1 and source 2 with this code 

    const jsonData = JSON.stringify({
      sources: {
        source_01: {
          source_type: obj.source_left.source.source_type === "files" ? "csv" : obj.source_left.source.source_type,
          location: "D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/"+obj.source_left.source.location,
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
          location: "D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/"+obj.source_right.source.location,
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
        destination_type: "csv",
        location: "D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/merged/merged_data.csv"
      }
    });
    

console.log(jsonData);

// Adjust the path to the Python script according to its location.
// Here, it's assumed that your_script.js is located in the node_script folder,
// and you want to access scripts.py located in the python_script folder.
const args = ['D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/script.py', jsonData];

// Spawn the child process
const childProcess = spawn(command, args);

// Listen for stdout data
childProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// Listen for stderr data
childProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// Listen for process exit
childProcess.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});

  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
