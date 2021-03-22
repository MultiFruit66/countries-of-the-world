const db = require('./../database.js');

exports['like.get'] = async(data, { userData }) => {
  if(!data.filter || typeof data.sort === 'undefined' || typeof data.limit === 'undefined') return { type: 'error', code: -32602, message: 'Invalid params' };
  const filteredData = db.filterData(data.filter, data.sort, data.limit);
  const sqlQuery = "SELECT * FROM likes" + filteredData;
  let { results, fields } = await db.connection.onpromise(sqlQuery, [])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
}

exports['like.unset'] = async(data, { userData }) => {
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  if(!data.post) return { type: 'error', code: -32602, message: 'Invalid params' };
  await db.connection.onpromise(`DELETE FROM likes WHERE likeUser = ? AND likePost = ?`, [userData.id, data.post]);
  return { type: 'success', result: { message: 'Вы успешно удалили лайк' } };
}

exports['like.set'] = async(data, { userData }) => {
  if(!userData.id) return { type: 'error', code: -403, message: 'Forbidden' };
  if(!data.post) return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results: r, fields: f } = await db.connection.onpromise(`SELECT likeId FROM likes WHERE likePost =  ? AND likeUser = ?`, [data.postid, userData.id])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  if(r.length > 0) return { type: 'error', code: 813, message: 'Вы уже оставляли лайк под этим постом!' };
  await db.connection.onpromise(`INSERT INTO likes(likePost, likeUser) VALUES (?, ?)`, [data.post, userData.id]);
  return { type: 'success', result: { message: 'Вы успешно оставили лайк' } };
}

exports['like.getUserLikes'] = async(data, { userData }) => {
  if(!data.user || typeof data.limit === 'undefined') return { type: 'error', code: -32602, message: 'Invalid params' };
  let { results, fields } = await db.connection.onpromise("SELECT * FROM likes,posts WHERE likes.likePost = posts.pId AND likes.likeUser = ? ORDER BY likeId DESC LIMIT ?", [data.user, data.limit])
  .catch((message) => {
    return { type: 'error', code: -101, message: 'Database error: ' + message };
  });
  return { type: 'success', result: results };
}