import Bluebird from 'bluebird';
import axios from 'axios/index';
import { getAccessToken } from './login';

export function uploadImage(file, imageType) {
  return Bluebird.try(() => {
    const data = new FormData();

    if (file) {
      data.append('picture', file);
      data.append('imageType', imageType);

      // fixme - might need to add baseUrl to configs depending on API url when deploying
      // todo - setup an axios interceptor to automatically inject the Authorisation header
      return axios.post('/api/upload-image', data, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(res => res.data);
    }
  });
}

/**
 * Generate a Full Image Url to the Cloudinary CDN
 * @param {string} publicId
 * @param {string} type - The type of image to be generated for the site. Will determine image properties
 * @return {string} The full HTTPS image url. Null if publicId is null
 */
export function getFullImageUrl(publicId, type) {
  const imageTypes = {
    'profileImage': 'c_fill,g_auto,w_200,h_200',
    'card': 'c_fill,g_auto,w_348,h_456'
  };

  const options = imageTypes[type];
  return publicId ? 
    `https://res.cloudinary.com/forgingadventures/image/upload/${options}/${publicId}.png`
    : null;
}
