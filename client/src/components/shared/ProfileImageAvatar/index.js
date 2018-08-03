import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Image } from 'semantic-ui-react';


const UserImageAvatar = (props) => {
  const { user: { profileImage }, size } = props;
  const publicId = _.get(profileImage, 'publicId');
  const url = _.get(profileImage, 'url');

  if (publicId) {
    return <CloudinaryImageAvatar publicId={publicId} size={size} />;
  } else if (url) {
    return <UrlImageAvatar url={url} size={size}/>;
  } else {
    return <NoProfileIcon size={size} />;
  }
};

UserImageAvatar.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.string
};

const CharacterImageAvatar = (props) => {
  const { character: { profileImage }, size } = props;
  const publicId = _.get(profileImage, 'publicId');

  if (publicId) {
    return <CloudinaryImageAvatar publicId={publicId} size={size} />;
  } else {
    return <NoAvatarIcon size={size} />;
  }
};

CharacterImageAvatar.propTypes = {
  character: PropTypes.object.isRequired,
  size: PropTypes.number
};

// private

function CloudinaryImageAvatar(props) {
  const { publicId, size } = props;
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;
  const width = {
    small: 80
  }[size] || 45;

  const url = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,h_${width*2},r_max,w_${width*2}/${publicId}`;

  return (
    <Image avatar size={size} src={url} />
  );
}

function UrlImageAvatar(props) {
  const { url, size } = props;

  return (
    <Image avatar size={size} src={url} />
  );
}

function NoAvatarIcon(props) {
  const { size } = props;
  const publicId = process.env.REACT_APP_CLOUDINARY_AVATAR_PLACEHOLDER;

  return (
    <CloudinaryImageAvatar publicId={publicId} size={size} />
  );
}

function NoProfileIcon(props) {
  const { size } = props;
  const publicId = process.env.REACT_APP_CLOUDINARY_PROFILE_PLACEHOLDER;

  return (
    <CloudinaryImageAvatar publicId={publicId} size={size} />
  );
}

export { UserImageAvatar, CharacterImageAvatar };
