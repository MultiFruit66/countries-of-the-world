const db = require('./../database.js');

exports['user.get'] = async(data, { userData }) => {
  try{
  if(!data.filter || typeof data.sort === 'undefined' || typeof data.limit === 'undefined') return { type: 'error', code: -32602, message: 'Invalid params' };
  const filteredData = db.filterData(data.filter, data.sort, data.limit);
  const sqlQuery = "SELECT * FROM users" + filteredData;
  let { results, fields } = await db.connection.onpromise(sqlQuery, [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
  }catch(e){console.error(e)}
}

exports['user.edit'] = async(data, { userData }) => {
  if(!data.user || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden-1' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden-2' };
  ////
  await db.connection.onpromise("UPDATE users SET "+db.parseParams(data.edit)+" WHERE uId = ?", [data.user])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Пользователь успешно изменен!' } };  
}

exports['user.delete'] = async(data, { userData }) => {
  if(!data.user) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  /////
  await db.connection.onpromise("DELETE FROM users WHERE uId = ?", [data.user])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Пользователь успешно удален!' } };
}

