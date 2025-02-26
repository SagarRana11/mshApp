import React, { useEffect } from "react";
import { FlatList, Text, ActivityIndicator, View, Button, ScrollView, Alert, StyleSheet, TextInput } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRequests } from "../../services";
import CalcificCard from "../../components/Card";

import {logout} from "../../services";
import { useNavigate } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-paper";
import {LinearGradient} from 'react-native-linear-gradient'

const AlarmList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
    getNextPageParam: (lastPage) => lastPage?.nextSkip ?? undefined, 
  });
  const navigate = useNavigate()

  const handleLogout = async () => {

    try {
      const loggedOut = await logout();
      console.log("Logout Response:", loggedOut);

      if (loggedOut?.data?.status === 'ok' && loggedOut?.data?.code === 200) {
        await AsyncStorage.removeItem("loggedUserToken"); 
        navigate('/');
      } else {
        Alert.alert("Logout Failed", "Unable to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "Something went wrong during logout.");
    }
  };

  if (status === "loading") return <ActivityIndicator size="large" />;
  if (status === "error") return <Text>Error fetching data</Text>;

  const requests = data?.pages.flatMap((page) => page.data) || [];
  const LogoutButton = ()=>{
    return(
       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button onPress={handleLogout} title="Logout" />
        </View>
    )
  }

  return (
   
      //  <SafeAreaView style={{flex:1}}>
      //     <SafeAreaProvider>
              <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
                  <LinearGradient 
                    colors={['#90d6fe', '#f7fcfe', 'white']} // Three colors
                    locations={[0, 0.90, 1]} // First color at 0%, Second at 50%, Third at 100%
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 0, y: 1 }} 
                    style={[styles.container, styles.header]}
                  >
                    <View style={styles.AlarmHistory}> 
                      <Icon source="message-text-outline" size={28} color="black" />
                      <Text style={{fontSize:25, fontWeight:600,}}>Alarm History </Text>
                      <Icon source="bell-outline" size={28} color="black" style={styles.chatIcon} />
                   </View>
                   <View style={styles.searchBox}>
                     <Icon source="magnify" size={28} color="" style={styles.chatIcon} /> 
                     <TextInput placeholder="search"  style={styles.textInput}/>
                   </View>
                 </LinearGradient>
                   
                <FlatList
                  contentContainerStyle={{ flexGrow: 1, paddingTop:160, backgroundColor:'white' }} 
                  data={requests}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <CalcificCard item={item}/>}
                  onEndReached={() => {
                    console.log("End reached! Fetching more...");
                    if (hasNextPage) {
                      fetchNextPage();
                    }
                  }}
                  onEndReachedThreshold={0.1} 
                  ListFooterComponent={() =>
                    isFetchingNextPage ? <ActivityIndicator size="large" /> : null
                  }
                />
                <LogoutButton />
              </View>
          
        //   </SafeAreaProvider>

        // </SafeAreaView> 
    
  );
};

const styles = StyleSheet.create({
  header:{
    width:'100%',
    paddingTop:20,
    justifyContent: 'center',
    alignItems:'center',

    position:'absolute',
    zIndex:10,
    top:0,
    backgroundColor:'white',
    
  },
  AlarmHistory: {
    width: '95%',
    marginBottom:18,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    fontSize: 20,
   
  },  
  chatIcon: {
    marginLeft: "auto",
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    width: "90%",
    borderRadius: 20,
    marginBottom: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: '#4fbfff',
    backgroundColor: '#fff',
  },
  
  textInput:{
    width:'95%',
    fontSize:18,
    padding:5,
    paddingLeft:10,
  }
})

export default AlarmList;
