import _ from 'lodash';
import aws from 'aws-sdk';
import Bluebird from 'bluebird';
import cloudinary from 'cloudinary';
import config from 'config';

import User from 'models/user';

export function postUsers() {
  return (req, res, next) => {
    const user = _.pick(req.body.data, ['auth0UserId', 'userMetadata', 'appMetadata']);

    User
      .query()
      .select('id')
      .where('auth0UserId', user.auth0UserId)
      .then((dbUser) => {
        if (dbUser.length) {
          // Patch existing User
          return User
            .query()
            .patch({
              userMetadata: user.userMetadata,
              appMetadata: user.appMetadata
            })
            .where('auth0UserId', user.auth0UserId)
            .returning('*');
        }

        // Create new User
        return User
          .query()
          .insert(user)
          .returning('*');
      })
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((error) => {
        next(error);
      });
  };
}

export function uploadUserPicture() {
  // req.file.
  return (req, res, next) => {
    // TODO create random filename
    const fileName = 'somerandomfilename';

    Bluebird.all([
      new Bluebird((resolve, reject) => {
        cloudinary.config({
          cloud_name: config.get('cloudinary.cloudName'),
          api_key: config.get('cloudinary.apiKey'),
          api_secret: config.get('cloudinary.apiSecret')
        });

        cloudinary.v2.uploader.upload_stream({
          public_id: fileName,
          resource_type: 'auto',
          tags: 'profile,user'
        }, (error, result) => {
          if (error) {
            return reject(error);
          }

          return resolve(result);
        })
          .end(req.file.buffer);
      }),
      s3UploadFile(req.file.buffer, fileName)
    ])
      .spread((cloudinaryResult, s3Result) => {
        console.log(JSON.stringify(cloudinaryResult));
        console.log(JSON.stringify(s3Result));

        // TODO write record to files table in db

        res.json({ cloudinaryId: cloudinaryResult.public_id });
      })
      .catch((error) => {
        next(error);
      });
  };
}

function s3UploadFile(fileBuffer, fileName) {
  // Only need to set key and secret in dev, othewise will grab from ECS IAM role
  aws.config.setPromisesDependency(Bluebird);
  console.log(`the env is:  ${process.env.NODE_ENV}`);
  // TODO should get NODE_ENV env var set
  // if (process.env.NODE_ENV === 'development') {
    aws.config.update({
      accessKeyId: config.get('aws.config.accessKeyId'),
      secretAccessKey: config.get('aws.config.secretAccessKey')
    });
  // }
  const s3 = new aws.S3();
  const options = {
    Body: fileBuffer,
    Bucket: config.get('aws.s3.userUploadsBucket'),
    Key: `${config.get('aws.s3.userUploadsPrefex')}/${fileName}`
  };

  return s3.upload(options)
    .promise();
}
