import React from 'react';
import {View, Text, Image, Dimensions, TouchableOpacity,Linking} from 'react-native';
import {useSelector} from 'react-redux';
let {width} = Dimensions.get('window');
export const ChatListItem = props => {
  const {item, nextUser = false, previousUser = false} = props;
  const user = useSelector(state => state.auth.user);
  console.log('user>>>>>>>>>>>>>>>>>>>>>', user);
  const {_id} = user;
  let {user: ItemUser} = item;
  let {photo, name: messageUserName, role, displayRole} = ItemUser;

  const sentByCurrentUser = _id === item.user._id;
  const isSameNextUser = nextUser === item.user._id;
  const isSamePreviousUser = previousUser === item.user._id;
  console.log(
    'isSameNextUser, isSamePreviousUser',
    isSameNextUser,
    isSamePreviousUser,
  );
  console.log('sentBySameUser', sentByCurrentUser);
  console.log(
    '=========================================================================',
  );
  console.log('item inside ChatListItem>>>>', item);
  console.log('previous user>>>>>', previousUser);
  console.log('nextUser>>>>>>>', nextUser);
  const messageRole = displayRole ? displayRole : role;
  let message = item.text && item.text.replace(/__NEW_LINE__/g, '\n');

  const getSentTime = time => {
    time = new Date(time);
    let hr = time.getHours();
    let min = time.getMinutes();
    hr = hr < 9 ? `0${hr}` : hr;
    min = min < 9 ? `0${min}` : min;
    return `${hr}:${min} `;
  };

  const openDailer = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`).catch(err =>
      console.log('Error opening dialer', err),
    );
  };

  const isValidPhoneNumber = phoneNumber => {
    const phoneRegex =
      /^(?:\+44\s?|0)?7\d{3}[\s-]?\d{3}[\s-]?\d{3}$|^(?:\+44\s?|0)?(1\d{2,4}|2\d{2,4}|3\d{2,4}|8\d{2,4}|9\d{2,4})[\s-]?\d{3}[\s-]?\d{3,4}$|^(?:\+1\s?|1)?(?:\(\s?\d{3}\s?\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}(?:\s?(?:ext|x)\s?\d{1,5})?$/i;
    return phoneRegex.test(phoneNumber);
  };
  return (
    <View
      style={[
        {flexDirection: 'row', paddingHorizontal:0},
        isSamePreviousUser ? {marginTop: 2} : {marginTop: 10},
        sentByCurrentUser ? {flexDirection: 'row-reverse'} : {},
      ]}>
      <View
        style={{
          width: 10,
        }}
      />
      {/* {!isSamePreviousUser && (
        <Image
          source={{
            uri: sentByCurrentUser
              ? profileImage
                ? profileImage
                : avatar
              : key != null && name != null
              ? getS3ImageUrl({key: photo.key, name: photo.name})
              : avatar,
          }}
          style={{
            position: 'absolute',
            height: 40,
            width: 40,
            borderRadius: 20,
            marginHorizontal: 24,
          }}
        />
      )} */}
      <View style={[sentByCurrentUser ? {marginRight: 1} : {marginLeft: 1}]}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: sentByCurrentUser ? 'flex-end' : 'flex-start',
            },
          ]}>
          <View
            style={[
              {paddingHorizontal: 10, justifyContent: 'center'},
              {
                backgroundColor: sentByCurrentUser
                  ? !item.image && '#4d98c5'
                  : 'rgba(155, 155, 155, 0.16)',
                borderRadius: 4,
                minHeight: 40,
                maxWidth: width - 48 - 10 - 40,
              },
            ]}>
            {message ? (
              isValidPhoneNumber(message) ? (
                <TouchableOpacity onPress={() => openDailer(message)}>
                  <Text
                    style={[
                      {
                        marginVertical: 8,
                        fontSize: 12,
                        lineHeight: 14,
                        letterSpacing: 0.43,
                        color: sentByCurrentUser ? '#fff' : '#616161',
                      },
                      {textDecorationLine: 'underline'},
                    ]}>
                    {message || ''}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Text
                    selectable
                    style={[
                      {
                        marginVertical: 8,
                        fontSize: 12,
                        lineHeight: 14,
                        letterSpacing: 0.43,
                        color: sentByCurrentUser ? '#fff' : '#616161',
                      },
                    ]}>
                    {message || ''}
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity onPress={() => imageClicked(item.image)}>
                <Image
                  source={{uri: item.image}}
                  resizeMode={'cover'}
                  style={{width: 150, height: 150}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!isSameNextUser && (
          <View
            style={[
              {marginTop: 4},
              sentByCurrentUser ? {alignItems: 'flex-end'} : {},
            ]}>
            <Text
              style={{
                fontSize: 10,
                // backgroundColor: 'pink',
                color: '#616161',
                lineHeight: 11,
                letterSpacing: 0.36,
              }}>
              {getSentTime(item._createdOn)}
              <Text style={{color: 'black'}}>{messageUserName}</Text>
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: 'black',
                lineHeight: 11,
                letterSpacing: 0.36,
              }}>
              {messageRole}
            </Text>

          </View>
        )}
      </View>
    </View>
  );
};
