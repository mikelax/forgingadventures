import shortid from 'shortid';
import config from 'config';
import Bluebird from 'bluebird';
import aws from 'aws-sdk/index';
import cloudinary from 'cloudinary';

import insertUserUpload from './userUploads';

const imageTypeTransformation = {
  userProfile: 'c_fill,g_auto,w_100,h_100',
  gameImage: 'c_fill,g_auto,w_348,h_456',
  characterProfile: 'c_fill,g_auto,w_348,h_456',
  messageImage: 'c_fill,g_auto,w_640,h_480'
};

export function uploadToCloudinary(file, dbUser, imageType) {
  return Bluebird.try(() => {
    const fileName = shortid.generate();
    const transform = imageTypeTransformation[imageType];

    if (!(transform)) {
      throw new Error(`${imageType} is not a valid imageType`);
    } else {
      return Bluebird.all([
        cloudinaryUploadFile(file.buffer, fileName),
        s3UploadFile(file.buffer, fileName)
      ])
        .spread((cloudinaryResult) => {
          return insertUserUpload(dbUser.id, cloudinaryResult.public_id, imageType, file)
            .then((dbResult) => {
              return {
                publicId: cloudinaryResult.public_id,
                cloudinaryVersion: cloudinaryResult.version,
                sourceUrl: cloudinaryResult.secure_url,
                imageUrl: `https://res.cloudinary.com/${config.get('cloudinary.cloudName')}/image/upload/${transform}/v${cloudinaryResult.version}/${cloudinaryResult.public_id}.png`,
                userUploadId: dbResult.id
              };
            });
        });
    }
  });
}

// private

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
        reject(error);
      } else {
        resolve(result);
      }
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

