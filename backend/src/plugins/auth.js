const db = require('./../database.js');
const jwt = require('jsonwebtoken');

exports['auth.login'] = async(data, { req, userData }) => {
  if(userData.id) return { type: 'error', code: 98, message: 'Вы уже авторизированы в системе!' };
  if(!data.username || !data.pass) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results, fields } = await db.connection.onpromise(`SELECT * FROM users WHERE uUsername = ? AND uPass = ? LIMIT 1`, [data.username, data.pass])
  .catch((message) => {
    return { type: 'error', code: -3111, message: 'Database error' };
  });
  if(results.length == 0){
    return { type: 'error', code: 99, message: 'Неверный логин или пароль!' };
  }
  const token = jwt.sign({ id: results[0].uId }, req.headers['user-agent'], { expiresIn: '1d' });
  return { type: 'success', result: { db: results[0], jwt: token } };
}


exports['auth.register'] = async(data, { req, userData }) => {
  if(userData.id) return { type: 'error', code: 100, message: 'Вы уже авторизированы в системе!' };
  if(!data.username || !data.pass || !data.email || !data.name || !data.surname || !data.avatar) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results, fields } = await db.connection.onpromise(`SELECT uId FROM users WHERE uUsername = ? LIMIT 1`, [data.username])
  .catch((message) => {
    return { type: 'error', code: -3112, message: 'Database error' };
  });
  if(results.length > 0){
    return { type: 'error', code: 101, message: 'Аккаунт с таким логином уже существует!' };
  }
  //////
  let { results: r } = await db.connection.onpromise(`INSERT INTO users(uUsername, uEmail, uName, uSurname, uPass, uAvatar) VALUES(?,?,?,?,?)`, [data.username, data.email, data.name, data.surname, data.pass, data.avatar])
  .catch((message) => {
    return { type: 'error', code: -3113, message: 'Database error' };
  });
  const token = jwt.sign({ id: r.insertId }, req.headers['user-agent'], { expiresIn: '1d' });
  return { type: 'success', result: { id: r.insertId, jwt: token } };
}