import aws from 'aws-sdk';
import Bluebird from 'bluebird';
import cloudinary from 'cloudinary';
import config from 'config';
import shortid from 'shortid';

import insertUserUpload from 'services/userUploads';


export function uploadUserPicture(req, res, next) {
  const fileName = shortid.generate();

  Bluebird.all([
    cloudinaryUploadFile(req.file.buffer, fileName),
    s3UploadFile(req.file.buffer, fileName)
  ])
    .spread((cloudinaryResult) => {
      const { dbUser } = req;

      return insertUserUpload(dbUser.id, cloudinaryResult.public_id, 'userProfile', req.file)
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
    })
    .then((responseData) => {
      res.json(responseData);
    })
    .catch((error) => {
      next(error);
    });
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
