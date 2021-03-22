const db = require('./../database.js');

exports['city.get'] = async(data, { userData }) => {
  if(!data.filter || typeof data.sort === 'undefined' || typeof data.limit === 'undefined') return { type: 'error', code: -32602, message: 'Invalid params' };
  const filteredData = db.filterData(data.filter, data.sort, data.limit);
  const sqlQuery = "SELECT ctName, ctId FROM city" + filteredData;
  let { results, fields } = await db.connection.onpromise(sqlQuery, [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
}

exports['city.create'] = async(data, { userData }) => {
  if(!data.create) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  let { results } = await db.connection.onpromise("INSERT INTO city(ctName, ctPopulation, ctSquare, ctCountry, ctRegion) VALUES (?, ?, ?, ?, ?)",
  [data.create.name, data.create.population, data.create.square, data.create.country, data.create.region])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { city: results.insertId, message: 'Город успешно создан!' } };
}

exports['city.edit'] = async(data, { userData }) => {
  if(!data.city || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  await db.connection.onpromise("UPDATE city SET "+db.parseParams(data.edit)+" WHERE ctId = ?", [data.city])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Город успешно изменен!' } };  
}

exports['city.delete'] = async(data, { userData }) => {
  if(!data.city) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  /////
  await db.connection.onpromise("DELETE FROM city WHERE ctId = ?", [data.city])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Город успешно удален!' } };
}

exports['city.data'] = async(data, { userData }) => {
  if(!data.city) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results: r1 } = await db.connection.onpromise("SELECT * FROM city WHERE ctId = ? LIMIT 1", [data.city])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  //////
  return { type: 'success', result: r1[0]};
}
