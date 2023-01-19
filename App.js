import * as React from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet, View, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const MyComponent = () => {
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [sound, setSound] = React.useState();

  const startFlow = async function () {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let distance = Infinity;
    console.log(distance);
    while (distance >= 1) {
      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      const currentLatitude = location.coords.latitude;
      const currentLongitude = location.coords.longitude;
      distance = getDistanceFromLatLonInKm(
        currentLatitude,
        currentLongitude,
        Number(latitude),
        Number(longitude)
      );
      console.log("distance = ", distance, new Date());
      if (distance < 1) {
        await playSound();
        Alert.alert(
          "You have reached your destination",
          `Coordinates: ${currentLatitude}, ${currentLongitude}`,
          [
            {
              text: "OK",
              // onPress: async () => {
              //   await stopPlayingSound();
              // },
            },
          ]
        );
      }
      setTimeout(() => {}, 5000);
    }
  };

  // async function stopPlayingSound() {
  //   console.log("Unloading sound");
  //   sound.unloadAsync();
  // }

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(require("./alarm.mp3"));
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  return (
    <>
      <View style={styles.appContainer}>
        <TextInput
          style={styles.TextInput1}
          label="Latitude"
          value={latitude}
          onChangeText={(x) => {
            setLatitude(x.replace(/[^0-9\.]/g, ""));
          }}
        />
        <TextInput
          style={styles.TextInput2}
          label="Longitude"
          value={longitude}
          onChangeText={(x) => {
            setLongitude(x.replace(/[^0-9\.]/g, ""));
          }}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="Set"
              color="#008b8b"
              onPress={() => {
                if (latitude == 0 || longitude == 0) {
                  Alert.alert("Please provide coordinates input :)");
                } else {
                  Alert.alert(
                    "Alarm Set",
                    `Coordinates: ${latitude}, ${longitude}`
                  );
                  startFlow();
                }
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#fff5ee",
  },
  TextInput1: {
    marginTop: 300,
    // marginLeft: 10,
    marginRight: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    backgroundColor: "#778899",
    color: "#e0ffff",
    width: "100%",
    padding: 7,
  },
  TextInput2: {
    marginTop: 10,
    // marginLeft: 10,
    marginRight: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    backgroundColor: "#778899",
    color: "#e0ffff",
    width: "100%",
    padding: 7,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    marginLeft: 140,
  },
  button: {
    width: 100,
    marginHorizontal: 8,
  },
});
