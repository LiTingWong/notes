var AWS = require('aws-sdk');
var util = require('util');
var config = require('./config.json');

// configure AWS
AWS.config.update({
  'region': 'us-west-2'
});

var sns = new AWS.SNS();

function publish(num) {
  var publishParams = {
    Message: JSON.stringify({
      "default": "hi",
      "APNS_SANDBOX": "{\"aps\":{\"alert\":\"message " + num + "\",\"sound\":\"default\",\"badge\": " + num + "}}"
    }),
    MessageStructure: "json",
    TopicArn: config.TopicArn,
  };

  sns.publish(publishParams, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    process.stdout.write(".");
    console.log(data);
  });
}

for (var i=0; i < 1; i++) {
  publish(i);
}
