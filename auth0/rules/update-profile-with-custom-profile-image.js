function (user, context, callback) {
  if (user.user_metadata.profileImage.imageUrl) {
    user.picture = user.user_metadata.profileImage.imageUrl;
  }
  
  callback(null, user, context);
}
