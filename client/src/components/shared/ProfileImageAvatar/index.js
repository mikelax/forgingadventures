import _ from 'lodash';
import React from 'react';
import { Image as SemanticImage } from 'semantic-ui-react';


export function UserImageAvatar(props) {
  const { user: { profileImage }, size = 'normal', ...rest } = props;
  const publicId = _.get(profileImage, 'publicId');
  const url = _.get(profileImage, 'url');

  if (publicId) {
    return <CloudinaryImageAvatar publicId={publicId} size={size} {...rest} />;
  } else if (url) {
    return <UrlImageAvatar url={url} size={size} {...rest} />;
  } else {
    return <NoProfileIcon size={size} {...rest} />;
  }

}

export function CharacterImageAvatar(props) {
  const { character: { profileImage }, size = 'normal', ...rest } = props;
  const publicId = _.get(profileImage, 'publicId');

  if (publicId) {
    return <CloudinaryImageAvatar publicId={publicId} size={size} {...rest} />;
  } else {
    return <NoAvatarIcon size={size} {...rest} />;
  }
}

// private

function CloudinaryImageAvatar(props) {
  const { publicId, size, ...rest } = props;
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;
  const width = {
    normal: 80
  }[size];

  return (
    <img src={`https://res.cloudinary.com/${cloudName}/image/upload/c_crop,g_auto,h_${width*4},r_max,w_${width*4}/c_fill,w_${width}/${publicId}`} alt="" {...rest}/>
  );
}

function UrlImageAvatar(props) {
  const { url, size, ...rest } = props;
  const avatarSize = {
    normal: 'tiny'
  }[size];

  return (
    <SemanticImage avatar size={avatarSize} src={url} {...rest} />
  );
}

function NoAvatarIcon(props) {
  const { size, ...rest } = props;
  const publicId = process.env.REACT_APP_CLOUDINARY_AVATAR_PLACEHOLDER;

  return (
    <CloudinaryImageAvatar publicId={publicId} size={size} {...rest} />
  );
}

function NoProfileIcon(props) {
  const { size, ...rest } = props;
  const publicId = process.env.REACT_APP_CLOUDINARY_PROFILE_PLACEHOLDER;

  return (
    <CloudinaryImageAvatar publicId={publicId} size={size} {...rest} />
  );
}
