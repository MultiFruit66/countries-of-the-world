const db = require('./../database.js');

exports['post.get'] = async(data, { userData }) => {
  if(!data.filter || typeof data.sort === 'undefined' || typeof data.limit === 'undefined')
    return { type: 'error', code: -32602, message: 'Invalid params' };

  const filteredData = db.filterData(data.filter, data.sort, data.limit);
  const sqlQuery = "SELECT * FROM posts" + filteredData;

  let { results, fields } = await db.connection.onpromise(sqlQuery, [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });

  return { type: 'success', result: results };
}

exports['post.create'] = async(data, { userData }) => {
  if(!data.create) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };

  let { results: r1 } = await db.connection.onpromise("INSERT INTO posts(pName, pText, pPhoto, pCountry, pAuthor) VALUES (?, ?, ?, ?, ?)", [data.create.title, data.create.text, data.create.photo, data.create.country, data.create.author])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { post: r1.insertId, message: 'Пост успешно создан!' } };
}

exports['post.edit'] = async(data, { userData }) => {
  if(!data.post || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };

  await db.connection.onpromise("UPDATE posts SET "+db.parseParams(data.edit)+" WHERE pId = ?", [data.post])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Пост успешно изменен!' } };  
}

exports['post.delete'] = async(data, { userData }) => {
  if(!data.post) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };

  await db.connection.onpromise("DELETE FROM posts WHERE pId = ?", [data.post])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Пост успешно удален!' } };
}

