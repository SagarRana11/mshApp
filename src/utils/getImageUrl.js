const getS3ImageUrl = ({key, name, withoutToken = false}) => {
  let url = withoutToken
    ? `/downloadImage/?`
    : `/download/s3/?inline=true&token=${token}&`;
  return `${downloadUrl}${url}fileKey=${key}&fileName=${name}`;
};

const getProfilePickUrl = ({user = {}, getS3ImageUrl, getImage}) => {
  console.log('getS3ImageUrl>>>>>>>>>>>', getS3ImageUrl.toString());
  const {photo, localUri} = user;
  return photo
    ? localUri
      ? {uri: localUri}
      : {
          uri: getS3ImageUrl({key: user.photo.key, name: user.photo.name}),
          cache: 'force-cache',
        }
    : getImage('defaultProfilePic');
};

//   downLoadUrl>>>>>>>>>>>>>>>> https://uatapi.stemicathaid.com
