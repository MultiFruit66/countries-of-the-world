const mysql = require('mysql2');
const dotenv = require('dotenv')

dotenv.config()

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.onpromise = (sql, params, cb) => new Promise((resolve, reject) => {
	connection.query(sql, params, (e, results, fields) => {
		if (cb) return cb(e, results, fields);
		return e ? reject(e) : resolve({results, fields});
	});
});

function filterData(filter = {}, sort = {}, limit = 0){
  let appear = false;
  let sqlQuery = "";
  for(let i in filter){
    if(!appear){
      sqlQuery += ` WHERE ${i} = ${filter[i]}`;
      appear = true;
    } else {
      sqlQuery += ` AND ${i} = ${filter[i]}`;
    }
  }
  appear = false;
  for(let i in sort){
    if(!appear){
      sqlQuery += ` ORDER BY ${i} ${sort[i]}`;
      appear = true;
    }
    else break;
  }
  if(limit > 0) sqlQuery += ` LIMIT ${limit}`;
  return sqlQuery;
}

async function isAdmin(userId){
  let { results } = await connection.onpromise("SELECT uAdmin FROM users WHERE uId = ? LIMIT 1", [userId])
  .catch((message) => {
    return false;
  });
  if(results.length == 0) return false;
  return Boolean(results[0].uAdmin);
}

function parseParams(params){
  let appear = false;
  let sqlQuery = "";
  for(let i in params){
    if(!appear) appear = true;
    else sqlQuery += ", ";
    sqlQuery += `${i} = "${params[i]}"`;
  }
  return sqlQuery;
}

module.exports = { connection, filterData, isAdmin, parseParams };