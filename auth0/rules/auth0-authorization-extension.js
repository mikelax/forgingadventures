/*
*  This rule been automatically generated by auth0-authz-extension
*  Updated by mholtzman@gmail.com, 2017-12-07T04:27:34.533Z
 */
function (user, context, callback) {
  var _ = require('lodash');
  var EXTENSION_URL = "https://forgingadventures-staging.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201";

  var audience = '';
  audience = audience || (context.request && context.request.query && context.request.query.audience);
  if (audience === 'urn:auth0-authz-api') {
    return callback(new UnauthorizedError('no_end_users'));
  }

  audience = audience || (context.request && context.request.body && context.request.body.audience);
  if (audience === 'urn:auth0-authz-api') {
    return callback(new UnauthorizedError('no_end_users'));
  }

  getPolicy(user, context, function(err, res, data) {
    if (err) {
      console.log('Error from Authorization Extension:', err);
      return callback(new UnauthorizedError('Authorization Extension: ' + err.message));
    }

    if (res.statusCode !== 200) {
      console.log('Error from Authorization Extension:', res.body || res.statusCode);
      return callback(
        new UnauthorizedError('Authorization Extension: ' + ((res.body && (res.body.message || res.body) || res.statusCode)))
      );
    }

    // Update the user object.
    user.roles = data.roles;
    user.permissions = data.permissions;

    return callback(null, user, context);
  });

  // Get the policy for the user.
  function getPolicy(user, context, cb) {
    request.post({
      url: EXTENSION_URL + "/api/users/" + user.user_id + "/policy/" + context.clientID,
      headers: {
        "x-api-key": "ae04970317027906c042db5ba6702ca5a743aa3669f2bdd1ed30da47c996a0ac"
      },
      json: {
        connectionName: context.connection || user.identities[0].connection,
        groups: user.groups
      },
      timeout: 5000
    }, cb);
  }
}
