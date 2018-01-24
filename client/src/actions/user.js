import Bluebird from 'bluebird';
import {meQuery} from '../queries/users';

export const GET_MY_DETAILS_SUCCESS = 'get_my_details_success';
export const GET_MY_DETAILS_FAILURE = 'get_my_details_failure';

export function getMyDetails() {
  return (dispatch, getState, client) => {
    return Bluebird.resolve(client.query({query: meQuery}))
      .tap(res => dispatch({type: GET_MY_DETAILS_SUCCESS, me: res.data.me}))
      .catch(error => dispatch({type: GET_MY_DETAILS_FAILURE, error}));
  };
}
