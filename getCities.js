const pg = require('pg');

exports.handler = (event, context, callback) => {
  const queryString = `select distinct region from dataviz_housing.prod.housing_api`;
  const conn = new pg.Client({
    host: 'dataviz-postgres-instance.c8mfekqb2rvu.us-east-2.rds.amazonaws.com',
    database: 'dataviz_housing',
    port: 5432,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD
  });
  conn.connect();
  conn.query(queryString, (err, res) => {
    if (err) {
      conn.end();
      callback(new Error('Error: 402 Query failed to execute.'));
    } else {
      conn.end();
      if (res.rows.length === 0) {
        callback(new Error('Error: 403 Query returned no rows.'));
      } else {
        callback(null, res.rows.map(a => a.region));
      }
    }
  });
};
