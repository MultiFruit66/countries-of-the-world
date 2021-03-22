const db = require('./../database.js');

exports['lang.get'] = async(data, { userData }) => {
  if(!data.lang) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results: r1 } = await db.connection.onpromise("SELECT * FROM langs WHERE langId = ? LIMIT 1", [data.lang])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  //////
  return { type: 'success', result: r1[0]};
}

exports['lang.country'] = async(data, { userData }) => {
  let { results, fields } = await db.connection.onpromise("SELECT * FROM langs, country_langs WHERE langId = clangLang", [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
}

exports['lang.city'] = async(data, { userData }) => {
  let { results, fields } = await db.connection.onpromise("SELECT * FROM langs, city_langs WHERE langId = citylangLang", [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
}

exports['lang.create'] = async(data, { userData }) => {
  if(!data.create) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  let { results } = await db.connection.onpromise("INSERT INTO langs(langName, langUkrName) VALUES (?, ?)",
  [data.create.name, data.create.ukrname])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { lang: results.insertId, message: 'Язык успешно создан!' } };
}

exports['lang.editCountry'] = async(data, { userData }) => {
  if(!data.country || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  let dataArray = Object.values(data.edit);
  await db.connection.onpromise("DELETE FROM country_langs WHERE clangCountry = ?", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });  
  for(let i in dataArray){
    await db.connection.onpromise("INSERT INTO country_langs (clangCountry, clangLang, clangOfficial, clangProcent) VALUES (?, ?, 0, ?)", [data.country, dataArray[i].id, dataArray[i].procent])
    .catch((message) => {
      return { type: 'error', code: -101, message: 'Database error: ' + message };
    });    
  }
  return { type: 'success', result: { message: 'Язык успешно изменен!' } };  
}

exports['lang.editCity'] = async(data, { userData }) => {
  if(!data.city || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  let dataArray = Object.values(data.edit);
  await db.connection.onpromise("DELETE FROM city_langs WHERE citylangCity = ?", [data.city])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });  
  for(let i in dataArray){
    await db.connection.onpromise("INSERT INTO city_langs (citylangCity, citylangLang, citylangProcent) VALUES (?, ?, ?)", [data.city, dataArray[i].id, dataArray[i].procent])
    .catch((message) => {
      return { type: 'error', code: -101, message: 'Database error: ' + message };
    });    
  }
  return { type: 'success', result: { message: 'Язык успешно изменен!' } };  
}

exports['lang.delete'] = async(data, { userData }) => {
  if(!data.lang) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  /////
  await db.connection.onpromise("DELETE FROM langs WHERE langId = ?", [data.lang])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Язык успешно удален!' } };
}
