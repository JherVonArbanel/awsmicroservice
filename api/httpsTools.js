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
    }
}