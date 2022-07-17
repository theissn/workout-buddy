import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { db } from "../helpers/db";

interface Exercise {
  id: number;
  title: string;
}

function getRoutines(setRoutines) {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM routines", [], (_, { rows: { _array } }) => {
      setRoutines(_array);
    });
  });
}

function ListItem({ item: { id, name }, startNewWorkout }) {
  return (
    <TouchableHighlight onPress={() => startNewWorkout(id)}>
      <View
        style={{
          paddingVertical: 15,
          paddingHorizontal: 12.5,
          borderColor: "#000",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fefefe",
          borderBottomWidth: 0.25,
        }}
      >
        <Text>{name}</Text>
      </View>
    </TouchableHighlight>
  );
}

const renderItem = (props) => <ListItem {...props} />;

export default function NewWorkoutModalScreen({ navigation }) {
  const [text, onChangeText] = useState("");
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    getRoutines(setRoutines);
  }, []);

  const startNewWorkout = (id: number) =>
    navigation.navigate({ name: "NewWorkout", params: { id }, merge: true });

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
      <FlatList
        data={routines}
        renderItem={({ item }) => renderItem({ item, startNewWorkout })}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
