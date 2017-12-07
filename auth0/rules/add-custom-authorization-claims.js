function (user, context, callback) {
  // Custom namespace, can be the same between environments (Tenants)
  var namespace = 'https://forgingadventures.com/claims/';

  // Only roles here, permissions are handled in separate Rule and not added to id token payload
  context.idToken[namespace + "roles"] = user.roles;
  
  callback(null, user, context);
}
