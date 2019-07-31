const AWS = require("aws-sdk");
const httpsTools = require("./httpsTools")

exports.handler = (event, context, callback) => {
  let countryCode = event['pathParameters']['code'];

  let options = {
  host: 'xecdapi.xe.com',
  port: 443,
  path: '/v1/convert_from.json/?from=USD&to=' + countryCode + '&amount=1',
  method: 'GET',
  headers: {
        'Authorization': 'Basic dGVzdDY0MzE2MTEzOTpqNTQ0ZW90Y2ljam5tMWh0aDY5N2xycThsaA=='
    }
  };
  
  return httpsTools.SendHttps(options)
                   .then(result => {
                      let selectedItem = result.body.to
                                               .filter(item => item.quotecurrency == countryCode);
                      return httpsTools.Response200({rate:selectedItem[0].mid});
                    });
}