import { useState } from "react";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { db } from "../helpers/db";

const SettingsButton = ({ action, text }) => (
  <TouchableHighlight
    onPress={action}
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
      {text}
    </Text>
  </TouchableHighlight>
);

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
  };

  const fetchTableFromDB = (table: string) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(`SELECT * FROM ${table}`, [], (_, { rows }) => {
          resolve(rows._array);
        });
      });
    });
  };

  const shareDB = async () => {
    const data = JSON.stringify({
      exercises: await fetchTableFromDB("exercises"),
      routines: await fetchTableFromDB("routines"),
      routine_exercises: await fetchTableFromDB("routine_exercises"),
      workouts: await fetchTableFromDB("workouts"),
      workouts_exercises: await fetchTableFromDB("workouts_exercises"),
    });

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "/db.json",
      data,
      { encoding: "utf8" }
    );

    await Sharing.shareAsync(FileSystem.documentDirectory + "/db.json", {
      dialogTitle: "Share Database File",
    });
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
      <SettingsButton text="Share DB" action={shareDB} />
      <View style={{ paddingTop: 10 }} />
      <SettingsButton text="Delete DB" action={deleteDB} />
    </View>
  );
}
