const AWS = require("aws-sdk");
const httpsTools = require("./httpsTools")
const dbClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try{
    let countryCode = event["pathParameters"]["code"];
    let timestamp = event["pathParameters"]["dateretrieved"];
    var datetime = new Date(timestamp);
    let currentCode =  countryCode + "_" + 
                        datetime.getUTCFullYear() +
                        ("0"+(datetime.getUTCMonth()+1)).slice(-2);
    var params = {
      TableName: "Currencies",
      KeyConditionExpression: 'Code = :partionKey and #ts <= :sortKey',
      ExpressionAttributeNames:{
        "#ts": "RetrievedStamp"
      },
      ExpressionAttributeValues: {
        ':partionKey': currentCode,
        ':sortKey': timestamp
      },
      Limit: '1',
      ScanIndexForward: false
    };

    paramsGet.ExpressionAttributeValues
    return dbClient.query(paramsGet)
      .promise()
      .then(result => {
        console.log(result);
          console.log(result);
          return httpsTools.response200({
            "dateretrieved": saveOptions.Item.RetrievedStamp,
            "value":saveOptions.Item.Value
          });
      });
  }
  catch(ex){
    console.log(ex);
    return httpsTools.response500("Please contact administrator.");
  }
}