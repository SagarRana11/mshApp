import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = ({ socketUrl }) => {
  const [socket, setSocket] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [callbacks, setCallbacks] = useState({});

  useEffect(() => {
    console.log("hey hey hey hey");
    const socketInstance = io.connect(socketUrl, { transports: ['polling', 'websocket'] });
    console.log('socketInstance', socketInstance);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      if (subscriptions.length > 0) {
        subscriptions.forEach(subscription => {
          socketInstance.emit('subscribe', subscription);
        });
      }
    });

    socketInstance.on('onServerUpdate', event => {
      const uid = event.uid;
      console.log("onServerUpdate", event);
      if (callbacks[uid]) {
        callbacks[uid](event);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('socket disconnected at client.');
      socketInstance.io.reconnect();
    });

    socketInstance.on('error', err => {
      console.log('Error in on connect Socket ::: ', err);
    });

    socketInstance.on('connect_error', err => {
      console.log('Socket connect Error ::: ', err);
    });

    return () => {
      socketInstance.close();
    };
  }, [socketUrl, subscriptions, callbacks]);

  console.log("callbacks---------___>", callbacks);

  const subscription = (subscribeInfo, callback) => {
    console.log("subscription from useSocket is called")

    if (!socket) return;
    const { model, query, ids, uid, globalParamValue, token, syncSubQueries } = subscribeInfo;
    const metadata = query._metadata;
    removeOldSubscribed({ uid, metadata, syncSubQueries });

    const updatedCallbacks = { ...callbacks, [uid]: callback };
    if (syncSubQueries && metadata && metadata._metadata) {
      const subQueriesInfo = metadata._metadata;
      for (const field in subQueriesInfo) {
        updatedCallbacks[`${uid}_${field}`] = callback;
        const nestedMetadata = subQueriesInfo[field]._metadata;
        if (nestedMetadata) {
          for (const childField in nestedMetadata) {
            updatedCallbacks[`${uid}_${field}_${childField}`] = callback;
          }
        }
      }
    }
    setCallbacks(updatedCallbacks);

    const subscribe = {
      modelId: model,
      query,
      ids,
      uid,
      subQueries: syncSubQueries,
      token,
      globalParamValue
    };
    setSubscriptions([...subscriptions, subscribe]);
    console.log("subscriptions from useSocket=========>", subscriptions);
    socket.emit('subscribe', subscribe);
  };

  const unsubscription = unsubscribeInfo => {
    if (!socket) return;

    const { uid, metadata, syncSubQueries } = unsubscribeInfo;
    removeOldSubscribed(unsubscribeInfo);
    socket.emit('removeSubscribe', { modelId: unsubscribeInfo.model, uid, metadata, subQueries: syncSubQueries });
  };

  const removeOldSubscribed = ({ uid, metadata, syncSubQueries }) => {
    const index = subscriptions.findIndex(sub => sub.uid === uid);
    if (index !== -1) {
      const newSubscriptions = [...subscriptions];
      newSubscriptions.splice(index, 1);
      setSubscriptions(newSubscriptions);

      const newCallbacks = { ...callbacks };
      delete newCallbacks[uid];
      if (syncSubQueries && metadata && metadata._metadata) {
        const subQueriesInfo = metadata._metadata;
        for (const field in subQueriesInfo) {
          delete newCallbacks[`${uid}_${field}`];
          const nestedMetadata = subQueriesInfo[field]._metadata;
          if (nestedMetadata) {
            for (const childField in nestedMetadata) {
              delete newCallbacks[`${uid}_${field}_${childField}`];
            }
          }
        }
      }
      setCallbacks(newCallbacks);
    }
  };

  const disconnectSocket = () => {
    if (socket) socket.close();
  };

  const connectSocket = () => {
    if (socket) socket.open();
  };

  return {
    subscription,
    unsubscription,
    disconnectSocket,
    connectSocket
  };
};

export default useSocket;