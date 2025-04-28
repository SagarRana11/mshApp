import io from 'socket.io-client';
import { REACT_APP_SOCKET_URL } from '../mshAppServices';

export function socketConnect(runSubscribe, cb) {
  try {
    const socket = io(REACT_APP_SOCKET_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    console.log("><><><><><><>>>>>>",socket)

    socket.on('connect', () => {
      console.log('Socket connected');
      runSubscribe?.(socket);
    });

    socket.on('onServerUpdate', event => {
      console.log('onServerUpdate:', event);
      cb?.(event);
    });

    socket.on('disconnect', reason => {
      console.warn('Socket disconnected:', reason);
    });

    socket.on('reconnect_attempt', attempt => {
      console.log('Reconnect attempt:', attempt);
    });

    socket.on('error', err => {
      console.error('Socket error:', err);
    });

    socket.on('connect_error', err => {
      console.error(' Connect error:', err);
    });

    return socket;
  } catch (error) {
    console.error(' Socket connection error:', error);
  }
}
