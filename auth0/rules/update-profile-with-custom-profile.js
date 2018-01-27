function (user, context, callback) {
  if (user.user_metadata) {
    if (user.user_metadata.profileImage) {
      user.picture = user.user_metadata.profileImage;
    }

    if (user.user_metadata.name) {
      user.name = user.user_metadata.name;
    }

    if (user.user_metadata.username) {
      user.nickname = user.user_metadata.username;
    }
  }
  
  callback(null, user, context);
}
