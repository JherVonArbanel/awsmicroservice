const https = require('https');

module.exports = {
    Response200 = (body) => {
        return { 
            "statusCode": 200, 
            "headers": {
                "Access-Control-Allow-Origin":"*"
            },
            "body": JSON.stringify(body)
        };
    },
    SendHttps = (options) => {
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