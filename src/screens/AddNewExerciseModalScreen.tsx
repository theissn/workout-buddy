import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextComponent,
  TextInput,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { openDatabase } from "expo-sqlite";
import { db } from "../helpers/db";

interface Exercise {
  id: number;
  title: string;
}

function getExercises(
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>
) {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM exercises", [], (_, { rows: { _array } }) => {
      setExercises(_array);
    });
  });
}

function ListItem({ id, name, updateSelectedExercises, deleteExercise }) {
  return (
    <View
      style={{
        paddingVertical: 7.5,
        paddingHorizontal: 12.5,
        borderColor: "#000",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fefefe",
        borderBottomWidth: 0.25,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <BouncyCheckbox
          fillColor="#000"
          size={17.5}
          onPress={(e) => updateSelectedExercises(e, id)}
        />
        <Text>{name}</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "flex-end",
        }}
      >
        <Button onPress={() => deleteExercise(id)} title="🚮" />
      </View>
    </View>
  );
}

const renderItem = ({ item, updateSelectedExercises, deleteExercise }) => (
  <ListItem
    {...item}
    updateSelectedExercises={updateSelectedExercises}
    deleteExercise={deleteExercise}
  />
);

export default function AddNewExerciseModalScreen({ navigation }) {
  const [text, onChangeText] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<Array<number>>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={saveSelectedExercisesToRoutine}
          accessibilityLabel="Go back to previous screen"
        />
      ),
    });
  }, [navigation, selected]);

  useEffect(() => {
    getExercises(setExercises);
  }, []);

  const saveSelectedExercisesToRoutine = () => {
    navigation.navigate({
      name: "NewRoutine",
      params: {
        selected: selected.map((id) =>
          exercises.find((exercise) => exercise.id === id)
        ),
      },
      merge: true,
    });
  };

  const addExercise = () => {
    db.transaction((tx) => {
      tx.executeSql(`INSERT INTO exercises (name) VALUES (?)`, [text]);
    });

    getExercises(setExercises);
  };

  const updateSelectedExercises = (action: boolean, id: number) => {
    const set = new Set(selected);
    action ? set.add(id) : set.delete(id);
    setSelected([...set]);
  };

  const deleteExercise = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM exercises WHERE id = ?`, [id]);
    });

    getExercises(setExercises);
  };

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{
            flex: 2,
            backgroundColor: "#fff",
            paddingVertical: 15,
            paddingHorizontal: 12.5,
          }}
          placeholder={`Exercise Name`}
          onChangeText={onChangeText}
          value={text}
        />
        <Button title="➕" onPress={() => addExercise()} />
      </View>
      <View style={{ padding: 10 }} />
      <FlatList
        data={exercises}
        renderItem={({ item }) =>
          renderItem({
            item,
            updateSelectedExercises,
            deleteExercise,
          })
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
