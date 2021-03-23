const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const jsonrpc = require('jsonrpc-lite');

process.on('unhandledRejection', (reason) => {
  process.exit(1);
});
process.env.TZ = 'Europe/Moscow';

console.log('\nПроизводится запуск бекенда')
console.log('Загрузка методов...');

const methods = {};

fs.readdirSync(`${__dirname}/plugins/`)
.filter(name => /\.js$/i.test(name))
.forEach(name => {
  let plugin = require(`${__dirname}/plugins/${name}`);
  for(let i in plugin){
    methods[i] = plugin[i];
  }
});

console.log(`Все методы загружены`);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

console.log('Регистрируем запросы...');

app.post('/api', verifyRequest, async function(req, res){
  const jsonRPCRequest = jsonrpc.parseObject(req.jsonrpc);

  if(!jsonRPCRequest.length){
    const jsonRPCResponse = await callMethod(jsonRPCRequest, req);
    res.json(jsonRPCResponse);
  } else {
    const jsonRPCResponse = [];
    for(let i = 0; i < jsonRPCRequest; i++){
      let response = await callMethod(jsonRPCRequest, req);
      jsonRPCResponse.push(response);
    }
    console.log('Response:', jsonRPCResponse);
    res.json(jsonRPCResponse);    
  }
});

console.log('Все запросы зарегистрированы');

app.listen(3001, function () {
  console.log('Приложение запущено на порту 3001 в режиме CORS');
});

async function callMethod(request, req){
  if(!methods[request.payload.method]){

    const response = jsonrpc.error(request.payload.id, new jsonrpc.JsonRpcError('Method not found', -32601));

    return response;
  }
  const methodResponse = await methods[request.payload.method](request.payload.params, { req, userData: req.userPayload || {} });

  let jsonRPCResponse = {};

  if(methodResponse.type == "success"){
    jsonRPCResponse = jsonrpc.success(request.payload.id, methodResponse.result);
  }
  else if(methodResponse.type == "notification"){
    jsonRPCResponse = jsonrpc.notification(methodResponse.method, methodResponse.params);
  }
  else if(methodResponse.type == "error"){
    jsonRPCResponse = jsonrpc.error(request.payload.id, new jsonrpc.JsonRpcError(methodResponse.message, methodResponse.code));
  }
  else {
    jsonRPCResponse = jsonrpc.error(request.payload.id, new jsonrpc.JsonRpcError('Invalid Request', -32600));
  }

  return jsonRPCResponse;
}

function verifyRequest(req, res, next){
  try {
    const jsonRequest = JSON.parse(Object.keys(req.body)[0]);
    req.jsonrpc = jsonRequest;

    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
      const bearerToken = bearerHeader.split(' ')[1];
      jwt.verify(bearerToken, req.headers['user-agent'], function(err, decoded) {
        if(!err){
          req.userPayload = decoded;
          console.log('userPayload', req.userPayload)
        }
        else console.log(err);
        next();
      });
    } else next();
  } catch(e) {
    res.json(jsonrpc.error('0', new jsonrpc.JsonRpcError('Parse error', -32700)));
  }
}