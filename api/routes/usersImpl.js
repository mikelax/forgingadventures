import _ from 'lodash';
import aws from 'aws-sdk';
import Bluebird from 'bluebird';
import cloudinary from 'cloudinary';
import config from 'config';

import { getAuth0User, patchAuth0Metadata } from 'services/auth0';
import serviceUser from 'services/user';
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
          return serviceUser.patchAuth0Metadata(user.auth0UserId, user.userMetadata, user.appMetadata);
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
    const fileName = generateFileName(req.file.originalname);

    Bluebird.all([
      cloudinaryUploadFile(req.file.buffer, fileName),
      s3UploadFile(req.file.buffer, fileName)
    ])
      .spread((cloudinaryResult, s3Result) => {
        console.log(JSON.stringify(cloudinaryResult));
        console.log(JSON.stringify(s3Result));

        // TODO Patch user metadata
        // TODO Call Auth0 API to update User
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
                return {
                  publicId: cloudinaryResult.public_id,
                  cloudinaryVersion: cloudinaryResult.version,
                  sourceUrl: cloudinaryResult.secure_url,
                  imageUrl: `https://res.cloudinary.com/${config.get('cloudinary.cloudName')}/image/upload/${cloudinaryResult.version}/${cloudinaryResult.public_id}.png`,
                  userUploadId: dbResult.id
                };
              });
          });
      })
      // .then((response) => {
      //   return getAuth0User(req.params.auth0Id, 'user_metadata,app_metadata')
      //     .then((auth0Response) => {
      //       const { user_metadata: userData, app_metadata: appData } = auth0Response;
      //       userData.profileImage.publicId = response.publicId;
      //       userData.profileImage.imageUrl = response.imageUrl;
      //       return patchAuth0Metadata(req.params.auth0Id, userData, appData);
      //     })
      //     .then(() => response);
      // })
      .then((responseData) => {
        res.json(responseData);
      })
      .catch((error) => {
        next(error);
      });
  };
}

/**
 * Calculate a unique filename to use for the public_id / URLs
 * @param {string} originalFilename - The original filename
 */
function generateFileName(originalFilename) {
  // TODO generate random filename
  return 'somerandomfilename1';
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
