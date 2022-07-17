import { openDatabase } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import { db } from "../helpers/db";
import { styles } from "../styles/global";

function getRoutines(setRoutines) {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM routines", [], (_, { rows: { _array } }) => {
      setRoutines(_array);
    });
  });
}

function ListItem({ item: { name, id }, editRoutine, deleteRoutine }) {
  return (
    <View
      style={{
        paddingVertical: 7.5,
        paddingHorizontal: 12.5,
        borderColor: "#000",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fefefe",
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Text>{name}</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "flex-end",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Button onPress={() => editRoutine(id)} title="✏️" />
          <Button onPress={() => deleteRoutine(id)} title="🗑" />
        </View>
      </View>
    </View>
  );
}

const renderItem = (props) => <ListItem {...props} />;

export default function RoutinesScreen({ navigation, route }) {
  const [routines, setRoutines] = useState([]);

  const { update = false } = route.params ?? {};

  useEffect(() => {
    getRoutines(setRoutines);
  }, [navigation, route, update]);

  const editRoutine = (id: number) =>
    navigation.navigate({ name: "NewRoutine", params: { id } });

  const deleteRoutine = (id: number) => {
    Alert.alert("Delete routine", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          db.transaction((tx) => {
            tx.executeSql(`DELETE FROM routines WHERE id = ?`, [id], () => {
              getRoutines(setRoutines);
            });
          });
        },
      },
    ]);
  };

  if (routines.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>
          Add your first routine by clicking the new workout button in the top
          right hand corner
        </Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
      <FlatList
        data={routines}
        renderItem={({ item }) =>
          renderItem({ item, editRoutine, deleteRoutine })
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
