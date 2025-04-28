import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Events from 'react-native-simple-events';

const TOOLBAR_HEIGHT = 64;
const PADDING_TOP_TOOLBAR = 0;
const TOTAL_TOOLBAR_HEIGHT = TOOLBAR_HEIGHT + PADDING_TOP_TOOLBAR;
const {width} = Dimensions.get('window');

export const showSnackBar = (data = {}) => {
  const {
    message = 'Your custom message',
    textColor = '#FFF',
    position = 'top',
    confirmText = 'OK',
    buttonColor = '#FFF',
    duration = 6000,
    animationTime = 200,
    backgroundColor = '#323232',
    onConfirm = () => {},
    onSwipe = () => {},
    ...otherProps
  } = data;

  Events.trigger('showSnackBar', {
    message,
    textColor,
    position,
    confirmText,
    buttonColor,
    duration,
    animationTime,
    backgroundColor,
    onConfirm,
    onSwipe,
    ...otherProps,
  });
};

const SnackBar = ({id = null}) => {
  const [snackBarData, setSnackBarData] = useState({
    message: 'Had a snack at snackBar.',
    confirmText: null,
    onConfirm: null,
    onSwipe: null,
    position: 'bottom',
    show: false,
    duration: 5000,
    animationTime: 250,
    height: TOOLBAR_HEIGHT,
    textColor: '#FFF',
    buttonColor: 'red',
    backgroundColor: '#323232',
  });

  const top = useRef(new Animated.Value(-1 * TOOLBAR_HEIGHT)).current;
  const bottom = useRef(new Animated.Value(-1 * TOOLBAR_HEIGHT)).current;
  const snackBarRef = useRef(null);
  let timeoutRef = useRef(null);

  const [snackBarStyle, setSnackBarStyle] = useState({
    opacity: 1,
    left: 0,
    top: 0,
  });

  useEffect(() => {
    const eventId = id || '123456789';

    Events.on('showSnackBar', eventId, onRequest);

    return () => {
      Events.remove('showSnackBar', eventId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [id]);

  const onRequest = useCallback(options => {
    if (!options.message) return;

    const {
      message,
      confirmText,
      onConfirm,
      onSwipe,
      position = 'bottom',
      height = TOOLBAR_HEIGHT,
      duration = 4000,
      animationTime = 250,
      show = true,
      ...otherOptions
    } = options;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setSnackBarData({
      message,
      confirmText,
      onConfirm,
      onSwipe,
      position,
      height,
      duration,
      show,
      ...otherOptions,
    });

    const animatedValue = position === 'top' ? top : bottom;

    timeoutRef.current = setTimeout(() => {
      setSnackBarStyle({opacity: 1, left: 0, top: 0});
      setSnackBarData(prev => ({...prev, show: false}));
    }, duration + 2 * animationTime);
  }, []);

  const hideSnackBar = () => {
    setSnackBarData(prev => ({...prev, show: false}));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx > Math.abs(gestureState.dy)) {
          setSnackBarStyle(prev => ({
            ...prev,
            left: prev.left + gestureState.dx,
            top: 0,
          }));
        } else if (snackBarStyle.top + gestureState.dy <= 0) {
          setSnackBarStyle(prev => ({
            ...prev,
            top: prev.top + gestureState.dy,
            left: 0,
          }));
        }
      },
      onPanResponderRelease: () => {
        setSnackBarStyle({opacity: 1, left: 0, top: 0});
      },
      onPanResponderTerminate: () => {
        setSnackBarStyle({opacity: 1, left: 0, top: 0});
      },
    }),
  ).current;

  if (!snackBarData.show) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          flexDirection: 'row',
          minHeight: snackBarData.height,
          height: TOOLBAR_HEIGHT,
          paddingTop: PADDING_TOP_TOOLBAR,
          width,
          backgroundColor: snackBarData.backgroundColor,
          paddingHorizontal: 24,
          shadowRadius: 2,
          shadowColor: 'black',
          shadowOffset: {height: 3, width: 1},
          shadowOpacity: 0.4,
          elevation: 24,
          zIndex: 50,
        },
        snackBarData.position === 'top' && {top},
        snackBarData.position === 'bottom' && {bottom},
        snackBarStyle,
      ]}
      ref={snackBarRef}
      {...panResponder.panHandlers}>
      <View style={{flex: 10, paddingVertical: 14, justifyContent: 'center'}}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={{color: snackBarData.textColor, fontSize: 14}}>
          {snackBarData.message}
        </Text>
      </View>
      {snackBarData.confirmText && (
        <View style={{flex: 2, paddingLeft: 24}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              hideSnackBar();
              snackBarData.onConfirm && snackBarData.onConfirm();
            }}
            style={{flex: 1}}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: snackBarData.buttonColor, fontSize: 14}}>
                {snackBarData.confirmText.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

export default SnackBar;
