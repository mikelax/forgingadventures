import _ from 'lodash';
import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
import { Icon, Image as SemanticImage } from 'semantic-ui-react';


export function UserImageAvatar(props) {
  const { user: { profileImage }, size = 'normal' } = props;
  const publicId = _.get(profileImage, 'publicId');
  const url = _.get(profileImage, 'url');

  if (publicId) {
    return <CloudinaryImageAvatar publicId={publicId} size={size}/>;
  } else if (url) {
    return <UrlImageAvatar url={url} size={size}/>;
  } else {
    return <NoAvatarIcon size={size}/>;
  }

}

export function CharacterImageAvatar(props) {
  const { character: { profileImage }, size = 'normal' } = props;
  const publicId = _.get(profileImage, 'publicId');

  if (publicId) {
    return <CloudinaryImageAvatar publicId={publicId} size={size}/>;
  } else {
    return <NoAvatarIcon size={size}/>;
  }
}

// private

function CloudinaryImageAvatar(props) {
  const { publicId, size } = props;
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;
  const width = {
    normal: 80
  }[size];

  return (
    <Image publicId={publicId} cloudName={cloudName}>
      <Transformation width={width*4} height={width*4} gravity="auto" radius="max" crop="crop"/>
      <Transformation width={width} crop="fill"/>
    </Image>
  );
}

function UrlImageAvatar(props) {
  const { url, size } = props;
  const avatarSize = {
    normal: 'tiny'
  }[size];

  return (
    <SemanticImage avatar size={avatarSize} src={url}/>
  );
}

function NoAvatarIcon(props) {
  const { size } = props;
  const fontSize = {
    normal: '40px'
  }[size];

  return (
    <Icon circular inverted name="user" size="big" style={{ fontSize }}/>
  );
}
