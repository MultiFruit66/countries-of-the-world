const db = require('./../database.js');

exports['data.upload'] = async(data, { userData }) => {
  if(!data.type || !data.data) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  if(data.type != "posts") return { type: 'error', code: 322, message: 'Неверный тип загружаемых данных' };
  let { results: r1 } = await db.connection.onpromise("INSERT INTO posts(pName, pText, pPhoto, pCountry, pAuthor) VALUES (?, ?, ?, ?, ?)", [data.data.title, data.data.text, data.data.photo, data.data.country, data.data.author])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { post: r1.insertId, message: 'Данные успешно добавлены в Базу Данных' } };
}
