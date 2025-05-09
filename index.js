/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
export default function Main() {
    return (
     <QueryClientProvider client={queryClient}>
        <PaperProvider >
           <App />
        </PaperProvider>
     </QueryClientProvider>   
     
    );
  }
AppRegistry.registerComponent(appName, () => Main);
