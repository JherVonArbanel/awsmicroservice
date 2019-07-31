const AWS = require("aws-sdk");
const httpsTools = require("./httpsTools")

exports.handler = (event, context, callback) => {
  try{
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

    return httpsTools.sendHttps(options)
      .then(() => {
        let currentDate = new Date();
        let selectedItem = result.body.to
          .filter(item => item.quotecurrency == countryCode);
        let currentCode =  countryCode + "_" + currentDate.getUTCFullYear() + (currentDate.getMonth()+1);
        let saveOptions = {
          TableName : "Currencies",
          Item: {
              Code: currentCode,
              Timestamp: currentDate.getTime(),
              Value: selectedItem[0].mid
          }
        };
        return docClient.put(saveOptions)
          .promise()
          .then(() => {
            return saveOptions;
          });
      })
      .then(result => {
          console.log(result);
          return httpsTools.response200(result);
      });
  }
  catch(ex){
    return httpsTools.response500(ex);
  }
}