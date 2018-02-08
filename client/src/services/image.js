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