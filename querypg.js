const pg = require('pg');
const jsonToPivotjson = require("json-to-pivot-json");

exports.handler = (event, context, callback) => {
  const searchCity = event.city;
  const searchMetric = event.metric;
  const parameters = [searchCity];
  let searchColumn;
  switch (searchMetric) {
    case 'median_price': {
      searchColumn = 'median_price';
      break;
    }
    case 'inventory': {
      searchColumn = 'inventory';
      break;
    }
    case 'sold_above_list': {
      searchColumn = 'sold_above_list';
      break;
    }
    case 'median_dom': {
      searchColumn = 'median_dom';
      break;
    }
    case 'new_listings': {
      searchColumn = 'new_listings';
      break;
    }
    case 'combined_rating': {
      searchColumn = 'combined_rating';
      break;
    }
    default: {
      searchColumn = 'error';
      break;
    }
  }
  if (searchColumn === 'error') {
    callback(new Error('Error: 401 Invalid metric provided'));
  }
  const queryString = `select region, end_date, ${searchColumn} from dataviz_housing.prod.housing_api WHERE region = $1`;
  const conn = new pg.Client({
    host: 'dataviz-postgres-instance.c8mfekqb2rvu.us-east-2.rds.amazonaws.com',
    database: 'dataviz_housing',
    port: 5432,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD
  });
  conn.connect();
  conn.query(queryString, parameters, (err, res) => {
    if (err) {
      conn.end();
      callback(new Error('Error: 402 Query failed to execute.'));
    } else {
      conn.end();
        const options = {
            row: 'region',
            column: 'end_date',
            value: searchColumn
        };
        if (res.rows.length===0) {
            callback(new Error('Error: 403 Query returned no rows.'));
        } else {
            const returnVal = jsonToPivotjson(res.rows, options)[0];
            delete returnVal.region;
            callback(null, returnVal);
        }
    }
  });
};
