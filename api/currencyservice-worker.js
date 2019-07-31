var AWS = require("aws-sdk");
const https = require('https');

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Test";
var params = {
  TableName: table,
  KeyConditionExpression: 'Code = :partionKey and #ts <= :sortKey',
  ExpressionAttributeNames:{
    "#ts": "Timestamp"
  },
  ExpressionAttributeValues: {
    ':partionKey': 'ARS_201901',
    ':sortKey': 108
  },
  Limit: '1',
  ScanIndexForward: false
};

var paramsPut = {
  TableName : table,
  Item: {
     Code: 'ARS_201901',
     Timestamp: 108,
     Value: 19
  }
};

var paramsGet = {
  TableName: table,
  KeyConditionExpression: 'Code = :partionKey and #ts > :sortKey',
  ExpressionAttributeNames:{
    "#ts": "Timestamp"
  },
  ExpressionAttributeValues: {
    ':partionKey': 'ARS_201901',
    ':sortKey': 0
  },
  ScanIndexForward: false
};

let options = {
    host : 'ecdapi.xe.com',
    path:  '/v1/convert_from.json/?from=USD&to=CAD,EUR,ARS&amount=1',
    headers: {
        'Authorization': 'Basic dGVzdDY0MzE2MTEzOTpqNTQ0ZW90Y2ljam5tMWh0aDY5N2xycThsaA=='
    },
};

exports.handler = (event, context, callback) => {
  var options = {
  host: 'xecdapi.xe.com',
  port: 443,
  path: '/v1/convert_from.json/?from=USD&to=CAD,EUR,ARS&amount=1',
  method: 'GET',
  headers: {
        'Authorization': 'Basic dGVzdDY0MzE2MTEzOTpqNTQ0ZW90Y2ljam5tMWh0aDY5N2xycThsaA=='
    }
  };
  
  var httpsCall = new Promise((resolve, reject) => {
    const req = https.request(options,
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk.toString()));
        res.on('error', reject);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve({statusCode: res.statusCode, headers: res.headers, body: body});
          } else {
            reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
          }
        });
      });
    req.on('error', reject);
    req.end();
  });
  
  return httpsCall.then(result => {
    console.log(JSON.parse(result.body));
    console.log(JSON.parse(result.body).to[0]);
    var selectedItem = JSON.parse(result.body).to
                           .filter(item => item.quotecurrency == "ARS");
    return selectedItem[0].mid;
  })
};