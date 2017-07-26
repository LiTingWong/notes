var AWS = require('aws-sdk');
var util = require('util');
var async = require('async');
var fs = require('fs');

// configure AWS
AWS.config.update({
  'region': 'us-west-2'
});

var sns = new AWS.SNS();
var sqs = new AWS.SQS();

var config = {};

function createPlatformApplication(cb) {
  var params = {
    Attributes: {
        PlatformCredential: `-----BEGIN PRIVATE KEY-----
-----END PRIVATE KEY-----
`,
        PlatformPrincipal: `-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----`,
    },
    Name: 'TestPlatform',
    Platform: 'APNS_SANDBOX'
  };

  sns.createPlatformApplication(params, function(err, data) {
    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }
    console.log(data);
    config.PlatformApplicationArn = data.PlatformApplicationArn;
    cb();
  })
}

function createTopic(cb) {
  sns.createTopic({
    'Name': 'demo'
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }
    console.log(util.inspect(result));
    config.TopicArn = result.TopicArn;
    cb();
  });
}

function createPlatformEndpoint(cb) {
  sns.createPlatformEndpoint({
    PlatformApplicationArn: config.PlatformApplicationArn, //get it from console
    Token: "<device token>" //device token for the app on the test device
  }, function(err, data) {
    if (err) {
      console.log("Subscribed data", err);
    }
    console.log(util.inspect(data));
    config.EndpointArn = data.EndpointArn;
    cb();
  });
}

function snsSubscribe(cb) {
  sns.subscribe({
    'TopicArn': config.TopicArn,
  'Protocol': 'application',
  'Endpoint': config.EndpointArn
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }

    console.log(util.inspect(result));

    cb();
  });

}

function writeConfigFile(cb) {
  fs.writeFile('config.json', JSON.stringify(config, null, 4), function(err) {
    if(err) {
      return cb(err);
    }

    console.log("config saved to config.json");
    cb();
  });

}

async.series([createPlatformApplication, createTopic, createPlatformEndpoint, snsSubscribe, writeConfigFile]);
