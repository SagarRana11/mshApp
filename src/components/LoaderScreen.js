import { View, ActivityIndicator, Text } from 'react-native';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#2978A0" />
  </View>
);

export default LoadingScreen;