function (user, context, callback) {
  var _ = require('lodash');
 
  // US West Region
  var AUTH_EXT_BASE_URL = configuration.AUTH_EXT_BASE_URL;
  var AUTH_EXT_TOKEN_URL = configuration.AUTH_EXT_TOKEN_URL;  // tenanturl/oauth/token
  
  if (user.roles && user.roles.length) {
    // user already configured, short-circuit out
    return callback(null, user, context);
  }

  // Get access token for Auth Ext API
  request.post({
    url: AUTH_EXT_TOKEN_URL,
    headers: {
      'content-type': 'application/json' 
    },
    json: {
      client_id: configuration.AUTH_EXT_CLIENT_ID,
      client_secret: configuration.AUTH_EXT_CLIENT_SECRET,
      audience: 'urn:auth0-authz-api',
      grant_type: 'client_credentials'
    }
  },
  function(err, response, body) {
    if (err) return callback(err);

    var accessToken = body.access_token;
    // Get List of Roles
    request.get({
      url: AUTH_EXT_BASE_URL + '/roles',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      json: true
    },
    function(err, response, body) {
      if (err) return callback(err);
      
      var defaultRole = _.find(body.roles, function(o) { return o.name === 'User'; });

      request.patch({
        url: AUTH_EXT_BASE_URL + '/users/' + user.user_id + '/roles',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: [defaultRole._id],
        json: true
      },
      function(err, response, body) {
        if (err) return callback(err);
        
        // Add new Role to user object
        var roles = user.roles || [];
        roles.push(defaultRole.name);
        user.roles = roles;
        console.log('Following roles are in user obj:  ' + JSON.stringify(user.roles));
        
        request.get({
          url: AUTH_EXT_BASE_URL + '/permissions',
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          json: true
        },
        function(err, response, body) {
          if (err) return callback(err);

          // find list of Perms that are included in the User Role
          var filteredPermissions = _(body.permissions)
          .filter(function(p) {
            return _.includes(defaultRole.permissions, p._id);
          })
          .map('name')
          .value();

          var permissions = user.permissions || [];
          user.permissions = _.union(permissions, filteredPermissions);
          return callback(null, user, context);
        });
      });
    });
  });
}
