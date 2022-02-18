import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Navigation } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn } from '../api/SignIn';

const SignInScreen = () => {

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token value in async storage', userToken);
    if (userToken === '') {
      // isAuthenticated = true;
    }
  };

  const loggedIn = async (username: string, password: string) => {
    console.log('Submit button pressed');
    //await AsyncStorage.setItem('userToken', '');
    // isAuthenticated = true;
    signIn(username, password);
  };

  useEffect(() => {
    checkToken();
  }, []);

  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const { navigate } = useNavigation<Navigation.SignIn>();
  return (
    <View style={styles.container}>
      <Text
        style={styles.form}>Sign in</Text>
      <TextInput
        style={styles.form}
        placeholder="Your login"
        onChangeText={value => setState({ ...state, username: value })}
      />
      <TextInput
        style={styles.form}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={value => setState({ ...state, password: value })}
      />
      <Button title="Submit" onPress={() =>  loggedIn(state.username, state.password)}
      />
      <Text>Dont have account yet?</Text>
      <Button title="Sign up" onPress={() => navigate('SignUp')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { height: 20, width: 100, margin: 10, borderWidth: 1, justifyContent: 'center' },
});

export default SignInScreen;
