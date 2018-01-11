import _ from 'lodash';
import aws from 'aws-sdk';
import Bluebird from 'bluebird';
import cloudinary from 'cloudinary';
import config from 'config';
import shortid from 'shortid';

import { getAuth0User, patchAuth0Metadata } from 'services/auth0';
import { patchUserAuth0Metadata } from 'services/user';
import User from 'models/user';
import insertUserUpload from 'services/userUploads';

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
          return patchUserAuth0Metadata(user.auth0UserId, user.userMetadata, user.appMetadata);
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
  return (req, res, next) => {
    const fileName = shortid.generate();

    Bluebird.all([
      cloudinaryUploadFile(req.file.buffer, fileName),
      s3UploadFile(req.file.buffer, fileName)
    ])
      .spread((cloudinaryResult) => {
        // TODO Patch user metadata
        return User
          .query()
          .select('id')
          .where('auth0UserId', req.params.auth0Id)
          .then((dbUser) => {
            if (!dbUser.length) {
              throw new Error('User not found');
            }

            return insertUserUpload(dbUser[0].id, cloudinaryResult.public_id, 'userProfile', req.file)
              .then((dbResult) => {
                const imageUrlTransformations = 'c_scale,w_600';
                return {
                  publicId: cloudinaryResult.public_id,
                  cloudinaryVersion: cloudinaryResult.version,
                  sourceUrl: cloudinaryResult.secure_url,
                  imageUrl: `https://res.cloudinary.com/${config.get('cloudinary.cloudName')}/image/upload/${imageUrlTransformations}/v${cloudinaryResult.version}/${cloudinaryResult.public_id}.png`,
                  userUploadId: dbResult.id
                };
              });
          });
      })
      .tap((response) => {
        return getAuth0User(req.params.auth0Id, 'user_metadata,app_metadata')
          .then((auth0Response) => {
            const { user_metadata: userData = {}, app_metadata: appData = {} } = auth0Response.data;
            _.set(userData, 'profileImage.publicId', response.publicId);
            _.set(userData, 'profileImage.imageUrl', response.imageUrl);
            return patchAuth0Metadata(req.params.auth0Id, userData, appData);
          })
          .then((profileMetadata) => {
            return patchUserAuth0Metadata(req.params.auth0Id,
              profileMetadata.userMetadata, profileMetadata.appMetadata);
          });
      })
      .then((responseData) => {
        res.json(responseData);
      })
      .catch((error) => {
        next(error);
      });
  };
}

function cloudinaryUploadFile(fileBuffer, fileName) {
  return new Bluebird((resolve, reject) => {
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
      .end(fileBuffer);
  });
}

function s3UploadFile(fileBuffer, fileName) {
  aws.config.setPromisesDependency(Bluebird);

  // Only need to set key and secret in dev, othewise will grab from ECS IAM role
  if (process.env.NODE_ENV === 'development') {
    aws.config.update({
      accessKeyId: config.get('aws.config.accessKeyId'),
      secretAccessKey: config.get('aws.config.secretAccessKey')
    });
  }
  const s3 = new aws.S3();
  const options = {
    Body: fileBuffer,
    Bucket: config.get('aws.s3.userUploadsBucket'),
    Key: `${config.get('aws.s3.userUploadsPrefex')}/${fileName}`
  };

  return s3.upload(options)
    .promise();
}
