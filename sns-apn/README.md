# SNS IOS Example

This is an example of using AWS SNS service to register an IOS app and publish to an endpoint. Prior to using this app, you should have already registered your app on Apple developer portal and have required certificate (APN ssl) ready. You should also have device token ready for the test device on which your app is running.

If you are unsure of how to set up your application, check this [wiki](https://github.com/LiTingWong/notes/wiki/Preparing-Device-for-APN-with-AWS).

The project is a modification of [marcallen](https://github.com/markcallen)'s git repository [snssqs](https://github.com/markcallen/snssqs) which use SNS to publish to SQS endpoint instead of application endpoint.

Check [here](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#publish-property) for the complete AWS SDK JavaScript doc.

## Prep
Log into your AWS console and create a new user in IAM. Make sure you save the users credentials.
Attach the User Policies for Amazon SQS Full Access and Amazon SNS Full Access.  

Create `~/.aws/credentials`

Add the access key and secret access key for the IAM user you just created.
```
[snssqs]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

Alternatively, you can add the credentials in code by modifying the AWS config in `create.js` and `publish.js`
```JavaScript
var sns = new AWS.SNS({
  "region": "us-west-2",
  "accessKeyId": '<YOUR_ACCESS_KEY_ID>',
  "secretAccessKey": '<YOUR_SECRET_ACCESS_KEY>',
});
```

### Get the APN certificate
Log into your Apple Developer Portal and download the APN certificate for your app.  
Double click on the certificate to load it in keychain.  
From keychain, export the certificate as .p12 format.

Log into your AWS console, SNS service -> Application -> create platform application -> choose Apple development -> choose the .p12 certificate -> load credentials from file.

It will show the certificate and private key in plain text in the text boxes. copy these values to `create.js`
```JavaScript
var params = {
  Attributes: {
      //fill in the private key here
      PlatformCredential: `-----BEGIN PRIVATE KEY-----
-----END PRIVATE KEY-----`,
      //fill in certificate here
      PlatformPrincipal: `-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----`,
  }
};
```



## Install Packages

npm install

## Create Topic and Queue

AWS_PROFILE=snssqs node create.js

## Run

### Publish
AWS_PROFILE=snssqs node publish.js
