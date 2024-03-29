const https = require('https');

module.exports = {
    response200: (result) => {
        return { 
            "statusCode": 200, 
            "headers": {
                "Access-Control-Allow-Origin":"*"
            },
            "body": JSON.stringify({
                "success":true,
                "result":result
            })
        };
    },
    response500: (error) => {
        return { 
            "statusCode": 500, 
            "headers": {
                "Access-Control-Allow-Origin":"*"
            },
            "body": JSON.stringify({
                "success":false,
                "result":error
            })
        };
    },
    sendHttps: (options) => {
        return new Promise((resolve, reject) => {
            const req = https.request(options,
              (res) => {
                let body = '';
                res.on('data', (chunk) => (body += chunk.toString()));
                res.on('error', reject);
                res.on('end', () => {
                  if (res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve({statusCode: res.statusCode, headers: res.headers, body: JSON.parse(body)});
                  } else {
                    reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
                  }
                });
              });
            req.on('error', reject);
            req.end();
        });
    }
}