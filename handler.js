'use strict';
var AWS = require('aws-sdk');
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: 'eu-west-1'});

module.exports.getstuff = async (event, context) => {
  
  return {
    statusCode: 200,
    body: JSON.stringify((await getRecordsFromDynamo()).Items),
  };
};

module.exports.poststuff = async (event, context) => {
  var body = JSON.parse(event.body);
  await writeRecordsToDynamo(body);
  return {
    statusCode: 200,
    body: JSON.stringify({yo: "yo!"}),
  };
}

async function writeRecordsToDynamo(data) {
  return new Promise(function(resolve,reject) {
    var params = {
      TableName : process.env.tablename,
      Item: data
    };
    client.put(params,function(err,data){
      if (err) reject(err);
      else resolve(data);
    });
  });

}

async function getRecordsFromDynamo() {
  return new Promise(function(resolve,reject) {
    var params = {
      TableName : process.env.tablename
    };
    client.scan(params,function(err,data){
      if (err) reject(err);
      else resolve(data);
    });
  });
}
