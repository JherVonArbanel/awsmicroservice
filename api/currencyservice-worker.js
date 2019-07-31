const AWS = require("aws-sdk");
const httpsTools = require("./httpsTools")
const dbClient = new AWS.DynamoDB.DocumentClient();

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
      .then((result) => {
        let currentDate = new Date();
        let selectedItem = result.body.to
          .filter(item => item.quotecurrency == countryCode);
        let currentCode =  countryCode + "_" + 
                           currentDate.getUTCFullYear() +
                           ("0"+(currentDate.getMonth()+1)).slice(-2);
        let saveOptions = {
          TableName : "Currencies",
          Item: {
              Code: currentCode,
              RetrievedStamp : currentDate.getTime(),
              Value: selectedItem[0].mid
          }
        };
        return dbClient.put(saveOptions)
          .promise()
          .then(() => {
            return httpsTools.response200({
              "dateretrieved": saveOptions.Item.RetrievedStamp,
              "value":saveOptions.Item.Value
            });
          });
      });
  }
  catch(ex){
    console.log(ex);
    return httpsTools.response500("Please contact administrator.");
  }
}