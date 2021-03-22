const db = require('./../database.js');

exports['nation.get'] = async(data, { userData }) => {
  if(!data.nation) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results: r1 } = await db.connection.onpromise("SELECT * FROM nation WHERE nId = ? LIMIT 1", [data.nation])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  //////
  return { type: 'success', result: r1[0]};
}

exports['nation.data'] = async(data, { userData }) => {
  let { results, fields } = await db.connection.onpromise("SELECT * FROM nation, nation_country WHERE nId = ncNation", [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
}

exports['nation.editCountry'] = async(data, { userData }) => {
  if(!data.country || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  let dataArray = Object.values(data.edit);
  await db.connection.onpromise("DELETE FROM nation_country WHERE ncCountry = ?", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });  
  for(let i in dataArray){
    await db.connection.onpromise("INSERT INTO nation_country (ncCountry, ncNation, ncProcent) VALUES (?, ?, ?)", [data.country, dataArray[i].id, dataArray[i].procent])
    .catch((message) => {
      return { type: 'error', code: -101, message: 'Database error: ' + message };
    });    
  }
  return { type: 'success', result: { message: 'Язык успешно изменен!' } };  
}

exports['nation.create'] = async(data, { userData }) => {
  if(!data.create) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  let { results } = await db.connection.onpromise("INSERT INTO nation(nName, nUkrName, nRace, nReligion) VALUES (?, ?, ?, ?)",
  [data.create.name, data.create.ukrname, data.create.race, data.create.religion])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { nation: results.insertId, message: 'Нация успешно создана!' } };
}
exports['nation.edit'] = async(data, { userData }) => {
  if(!data.nation || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  await db.connection.onpromise("UPDATE nation SET "+db.parseParams(data.edit)+" WHERE nId = ?", [data.nation])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Нация успешно изменена!' } }; 
}

exports['nation.delete'] = async(data, { userData }) => {
  if(!data.nation) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  /////
  await db.connection.onpromise("DELETE FROM nation WHERE nId = ?", [data.nation])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Нация успешно удалена!' } };
}
