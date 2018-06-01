const _ = require('lodash');
const AWS = require('aws-sdk');
const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));

AWS.config.setPromisesDependency(Bluebird);

const ssm = new AWS.SSM({
  region: 'us-east-1'
});

new Bluebird(async (resolve, reject) => {
  const secrets = [];
  let nextToken;

  while (true) { // eslint-disable-line no-constant-condition
    try {
      const out = await getParams(nextToken); // eslint-disable-line no-await-in-loop

      secrets.push(out.Parameters);
      nextToken = out.NextToken;

      if (_.isEmpty(nextToken)) {
        resolve(_.flatten(secrets));
        break;
      }
    } catch (e) {
      reject(e);
    }
  }
})
  .each((secret) => {
    const env = _(secret.Name).split('/').last();
    fs.writeFileAsync(`/etc/container_environment/${env}`, secret.Value);
  })
  .catch((e) => {
    console.log('Error', e); // eslint-disable-line no-console
    process.exit(1);
  });

// private

function getParams(nextToken) {
  const params = {
    Path: `/${process.env.APP_NAME}/${process.env.PASSENGER_APP_ENV}`,
    MaxResults: 10,
    Recursive: true,
    WithDecryption: true,
    NextToken: nextToken
  };

  return ssm.getParametersByPath(params).promise();
}
