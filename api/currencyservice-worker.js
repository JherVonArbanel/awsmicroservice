var AWS = require("aws-sdk");
const https = require('https');


exports.handler = (event, context, callback) => {
  let countryCode = event['pathParameters']['code'];
  var options = {
  host: 'xecdapi.xe.com',
  port: 443,
  path: '/v1/convert_from.json/?from=USD&to=' + countryCode + '&amount=1',
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
                           .filter(item => item.quotecurrency == countryCode);
    return { statusCode: 200, 
             headers: {
                "Access-Control-Allow-Origin":"*"
             },
             body: JSON.stringify({rate:selectedItem[0].mid})
            };
    })
}