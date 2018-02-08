import { uploadToCloudinary } from 'services/cloudinary';


export function uploadUserPicture(req, res, next) {
  return uploadToCloudinary(req.file, req.dbUser, req.body.imageType)
    .then(responseData => res.json(responseData))
    .catch(error => next(error));
}
