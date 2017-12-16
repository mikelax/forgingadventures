function (user, context, callback) {

  var baseURL = configuration.API_BASE_URL;
  var postURL = baseURL + "/users/";

  var userPayload = {
    "auth0UserId": user.user_id,
    "userMetadata": user.user_metadata,
    "appMetadata": user.app_metadata
  };

  request.post({
    "headers": {
      'content-type':'application/json'
    },
    "url": postURL,
    "json": userPayload
  },
  function(err, response, body) {
    if (err) return callback(err);

    user.app_metadata = user.app_metadata || {};
    user.app_metadata.faUserId = response[0].id;
    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function() {
        // TODO Do we need to resync back to PG or wait until second user login
        return callback(null, user, context);
      });
  });
}
