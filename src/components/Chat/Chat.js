import React, {useState, useEffect, useRef} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';
import get from 'lodash/get';
import {ChatListItem} from './ChatListItem';
import {FlatList, StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import PubNub from 'pubnub';
import {useSelector} from 'react-redux';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';

import {socketConnect} from '../../services/socket';
import {
  getChatMessages,
  sendChatMessages,
} from '../../services/getChatMessages';
import AlarmRaiseTimer from '../AlarmRaisedTimer';
import {
  REACT_APP_PUBNUB_PUBLISH_KEY,
  REACT_APP_PUBNUB_SUBSCRIBE_KEY,
} from '../../mshAppServices';
import {messageIdGenerator} from './helpers';
import {styles} from './styles';
const pubnub = new PubNub({
  publishKey: REACT_APP_PUBNUB_PUBLISH_KEY,
  subscribeKey: REACT_APP_PUBNUB_SUBSCRIBE_KEY,
  uuid: 'your-unique-user-id',
});

const Chat = () => {
  const auth = useSelector(state => state.auth);
  const {user, token} = auth;
  const uuidRef = useRef(null);
  const socketRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatState, setChatState] = useState({});
  const route = useRoute();
  const {item: request, pubnubProps} = route.params;
  const {
    first_medical_contact,
    move_to_cathlab_On,
    status,
    move_to_cathlab,
    status_updated_on,
    _id: requestId,
  } = request;
  const {channel_id, notificationChannel, id, role} = pubnubProps;
  console.log('channel_id>>', channel_id);
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useInfiniteQuery({
      queryKey: ['chat', channel_id],
      queryFn: getChatMessages,
      getNextPageParam: lastPage => lastPage?.nextSkip ?? undefined,
    });
  let messages = data?.pages.flatMap(page => page.data);
  const updateCallback = event => {
    console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!event:', event);
    const newChat = event.insert;
    console.log('newChat>>>>>>>>>>>>>', newChat);
  };
  if (!uuidRef.current) uuidRef.current = uuidv4();
  const runSubscribe = socket => {
    console.log('>>>>>uuid', uuidRef.current);
    console.log('scokets>>>>>', socket);
    socket &&
      socket.emit('subscribe', {
        modelId: 'PubnubChat',
        uid: uuidRef.current,
        token: token,
        query: {
          _query: {
            id: 'allPubnubChats',
            addOnFilter: {
              channel_id: channel_id,
            },
            skip: 0,
            metadata: true,
            limit: 20,
            dataParams: {},
          },
          _metadata: {
            sort: {
              _id: -1,
            },
            fields: {
              _id: 1,
              messageType: 1,
              text: 1,
              image: 1,
              channel_id: 1,
              _createdOn: 1,
              user: { _id: 1, name: 1, role: 1,displayRole:1 }
            },
            _metadata: {},
          },
        },
      },(response)=>{
        if(response.status === 'ok'){
          console.log("Emit successful! Server processed it.");
        }else {
          console.error("Server reported an error:", response.error);
        }
      } );
  };

  useEffect(() => {
    socketRef.current = socketConnect(runSubscribe, event =>
      updateCallback(event),
    );
    console.log('SocketRef initialized:', socketRef.current);
    socketRef.current &&
      socketRef.current &&
      socketRef.current.on('disconnect', () => {
        console.log('>>>>>>>socket disconnected at client>>>.');
      });
  }, []);

  const listener = {
    message: event => {
      console.log('event occured', event);
      messages = [event.message[0], ...messages];
    },
  };

  const arroundMessage = (item, index = 0) => {
    let totalMessages = messages.length;
    let messageIndex = messages.indexOf(item);
    return messageIndex + index + 1 > totalMessages
      ? false
      : get(messages, `${[messageIndex + index]}.user._id`, false);
  };

  const pubnubSubscription = () => {
    setChatState(prevState => ({
      ...prevState,
      channel_id: channel_id,
      notificationChannel: notificationChannel,
      role: role,
    }));
    // set S3 imaging here
    pubnub.subscribe({channels: [channel_id], withPresence: true});

    pubnub.addListener(listener);
  };

  const onSend = async (messages = '', id, user) => {
    try {
      const text = messages && messages.trim();
      let message = {
        messageType: 'text',
        _id: messageIdGenerator(),
        _createdOn: new Date(),
        user: {...user},
        text,
        channel_id: channel_id,
      };

      pubnub.publish(
        {
          message: [message],
          channel: channel_id,
        },
        (response, error) => {},
      );

      sendChatMessages({channel_id: channel_id, messages, userId: user._id});
      // sendNotification([message], id);
    } catch (error) {
      console.log('saveMessagesError>>>>', error);
    }
  };

  useEffect(() => {
    pubnubSubscription();
    return () => {
      pubnub.unsubscribeAll();
      pubnub.removeListener(listener);
    };
  }, []);

  const handleSend = () => {
    const messageToSend = message && message.trim();
    if (!messageToSend) return;
    onSend(messageToSend, id, {
      _id: user._id,
      name: user.name,
      role: user.role,
      displayRole: user.displayRole,
    });
    setMessage('');
  };

  return (
    <>
      <View style={styles.timerContainer}>
        <Icon source="timer-outline" size={20} color="red" />
        <AlarmRaiseTimer
          style={styles.textStyle}
          AlarmRaisedTime={first_medical_contact}
          AlarmUpdatedOn={
            move_to_cathlab_On ? move_to_cathlab_On : status_updated_on
          }
          showTimer={
            status === 'Rejected' ||
            move_to_cathlab ||
            status === 'Completed' ||
            status === 'Reject with transfer'
              ? false
              : true
          }
          index={requestId}
        />
      </View>

      <FlatList
        inverted={true}
        keyExtractor={(item, index) => item._id}
        data={messages}
        bounces={false}
        renderItem={({item}) => (
          <ChatListItem
            item={item}
            nextUser={arroundMessage(item, -1)}
            previousUser={arroundMessage(item, 1)}
          />
        )}
      />

      <TextInput
        label="message"
        value={message}
        outlineColor="#2978A0"
        activeOutlineColor="#2978A0"
        onChangeText={text => setMessage(text)}
        style={{width: '90%', marginLeft: 20, marginTop: 20}}
        right={
          <TextInput.Icon
            icon="send"
            size={30}
            editable={false}
            // style={styles.input}
            onPress={handleSend}
          />
        }
      />
    </>
  );
};
export default Chat;
