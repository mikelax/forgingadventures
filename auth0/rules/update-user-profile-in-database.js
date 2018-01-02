function (user, context, callback) {

  var baseURL = configuration.API_BASE_URL;
  var postURL = baseURL + "/api/users/";

  var userPayload = {
    "meta": {
      "sharedSecret": configuration.SHARED_SECRET
    },
    "data": {
      "auth0UserId": user.user_id,
      "userMetadata": user.user_metadata,
      "appMetadata": user.app_metadata
    }
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
    // Can't figure out why sometimes response is array or not
    user.app_metadata.faUserId = body[0].id || body.id;
    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function() {
        // TODO Do we need to resync back to PG or wait until second user login
        return callback(null, user, context);
      })
      .catch(function(err) {
        callback(err);
      });
  });
}
