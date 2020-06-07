import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import logo from './assets/splash.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

const openImagePicker = async (payload = {}, callback = () => { }) => {
  const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

  if (!permissionResult.granted) {
    alert("Permission to access camera roll is required!");
    return;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync();

  if (pickerResult.cancelled) return;
  callback({ ...payload, localUri: pickerResult.uri })
}

const openShareImageDialog = async (state) => {
  if (!(await Sharing.isAvailableAsync())) {
    alert('Sharing is not available on this device!');
    return;
  }

  if (!state || !state.localUri) {
    alert('Something went wrong');
    return;
  }

  Sharing.shareAsync(state.localUri)
}

export default function App() {
  const [state, setState] = useState({
    localUri: null,
  });

  const onPressHandler = () => {
    openImagePicker(state, setState);
  }


  const onPressDiscradHandler = () => {
    setState({
      ...state,
      localUri: null,
    })
  }

  const onPressShareHandler = () => {
    openShareImageDialog(state);
  }

  const getImageToPrint = () => {
    return state.localUri
      ? { uri: state.localUri }
      : logo
  }

  const getTextToPring = () => {
    return state.localUri
      ? 'Tap on image to change it'
      : 'To share photo from this device, press button above'
  }

  const getImageStyles = () => {
    return state.localUri
      ? styles.image
      : styles.placeholder
  }

  const getButtonToPrint = () => {
    if (!state.localUri) return null;
    return (
      <TouchableOpacity onPress={onPressDiscradHandler}>
        <Text style={styles.discard}>Discard image</Text>
      </TouchableOpacity>
    )
  }

  const getShareButtonToPrint = () => {
    if (!state.localUri) return null;
    return (
      <TouchableOpacity onPress={onPressShareHandler}>
        <Text style={styles.share}>Share image.</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPressHandler}
      >
        <Image
          source={getImageToPrint()}
          style={getImageStyles()}
        />
      </TouchableOpacity>
      <Text style={styles.text}>
        {getTextToPring()}
      </Text>
      {getButtonToPrint()}
      {getShareButtonToPrint()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },

  placeholder: {
    width: 200,
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 100,
  },

  image: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.1)',
    resizeMode: 'contain'
  },

  discard: {
    color: "#555",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 5,
    padding: 20,
    width: 300,
    textAlign: "center"
  },

  share: {
    color: "white",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "rgb(0,150,0)",
    borderRadius: 5,
    padding: 20,
    width: 300,
    textAlign: "center"
  }
});
