import { openDatabase } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { db } from "../helpers/db";
import { styles } from "../styles/global";

export default function SettingsScreen({ navigation, route }) {
  const [isLoading, setLoading] = useState(false);

  const deleteDB = () => {
    Alert.alert("Delete Database?", "This will delete all workout history", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          db.closeAsync();
          db.deleteAsync();

          Alert.alert(
            "Database Deleted",
            "Please restart the app to avoid errors"
          );
        },
      },
    ]);

    // BackHandler.exitApp();
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <TouchableHighlight
        onPress={deleteDB}
        style={{
          width: "100%",
          backgroundColor: "#000",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
          }}
        >
          Delete DB
        </Text>
      </TouchableHighlight>
    </View>
  );
}
