import Bluebird from 'bluebird';
import UserUpload from 'models/userUpload';

/**
 * Create a new User Upload Record
 * @param {integer} userId - The user Id
 * @param {string} publicId - The CDN (cloudinary) public ID used for URLs
 * @param {string} type - The type of file to be uploaded
 * @param {Object} file - The File Object from multer middleware
 */
export default function insertUserUpload(userId, publicId, type, { originalname, mimetype, size }) {
  return Bluebird.try(() => {
    return UserUpload
      .query()
      .insert({
        userId,
        publicId,
        type,
        originalFilename: originalname,
        mimeType: mimetype,
        size
      });
  });
}
