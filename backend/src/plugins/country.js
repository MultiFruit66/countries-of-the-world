const db = require('./../database.js');

exports['country.get'] = async(data, { userData }) => {
  if(!data.filter || typeof data.sort === 'undefined' || typeof data.limit === 'undefined') return { type: 'error', code: -32602, message: 'Invalid params' };
  const filteredData = db.filterData(data.filter, data.sort, data.limit);
  const sqlQuery = "SELECT cName, cId FROM country" + filteredData;
  let { results, fields } = await db.connection.onpromise(sqlQuery, [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
}

exports['country.create'] = async(data, { userData }) => {
  try{
  if(!data.create) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  let { results } = await db.connection.onpromise("INSERT INTO country(cName, cCapital, cPolity, cMainland, cGrowth, cMigrBalance, cPopState, cNominalGDP, cRealGDP, cDevEconomy, cSquare, cPopulation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  [data.create.name, data.create.capital, data.create.polity, data.create.mainland, data.create.growth, data.create.migrbalance, data.create.popstate, data.create.nominalgdp, data.create.realgdp, data.create.deveconomy, data.create.square, data.create.population])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { country: results.insertId, message: 'Страна успешно создана!' } };
}catch(e){console.error(e)}
}

exports['country.edit'] = async(data, { userData }) => {
  if(!data.country || !data.edit) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  ////
  await db.connection.onpromise("UPDATE country SET "+db.parseParams(data.edit)+" WHERE cId = ?", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Страна успешно изменена!' } };  
}

exports['country.delete'] = async(data, { userData }) => {
  if(!data.country) return { type: 'error', code: -32602, message: 'Invalid params' };
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  const isAdmin = db.isAdmin(userData.id);
  if(!isAdmin) return { type: 'error', code: -403, message: 'Forbidden' };
  /////
  await db.connection.onpromise("DELETE FROM country WHERE cId = ?", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { message: 'Страна успешно удалена!' } };
}

exports['country.data'] = async(data, { userData }) => {
  if(!data.country) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results: r1 } = await db.connection.onpromise("SELECT * FROM country WHERE cId = ? LIMIT 1", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  //////
  return { type: 'success', result: r1[0]};
}

exports['country.getInfo'] = async(data, { userData }) => {
  if(!data.country) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results: r1 } = await db.connection.onpromise("SELECT * FROM country WHERE cId = ? LIMIT 1", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  //////
  let { results: r2 } = await db.connection.onpromise("SELECT * FROM city, city_langs, langs WHERE ctCountry = ? AND citylangCity = ctId AND citylangLang = langId", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  let cityArray = {};
  for(let i in r2){
    let id = r2[i].ctId;
    if(cityArray[id] == undefined){
      cityArray[id] = {
        name: r2[i].ctName,
        population: r2[i].ctPopulation,
        square: r2[i].ctSquare,
        region: r2[i].ctRegion,
        langs: []
      };
    }
    cityArray[id].langs.push({ lang: r2[i].langName, procent: r2[i].citylangProcent });
  }
  //////
  let { results: r4 } = await db.connection.onpromise("SELECT * FROM langs, country_langs WHERE clangCountry = ? AND clangLang = langId", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  //////
  let { results: r3 } = await db.connection.onpromise("SELECT * FROM nation, nation_country WHERE ncCountry = ? AND ncNation = nId", [data.country])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: { country: r1[0], city: cityArray, nations: r3, langs: r4 } };
}

