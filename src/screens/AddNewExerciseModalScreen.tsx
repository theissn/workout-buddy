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

const db = openDatabase("db-v2");

interface Exercise {
  id: number;
  title: string;
}

function ListItem({
  id,
  name,
  addSelectedExercises,
  deleteSelectedExercises,
  deleteExercise,
}) {
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
          onPress={(e) => addSelectedExercises(e, id)}
          // onPressIn={() => addSelectedExercises(id)}
          // onPressOut={() => deleteSelectedExercises(id)}
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

const renderItem = ({
  item,
  addSelectedExercises,
  deleteSelectedExercises,
  deleteExercise,
}) => (
  <ListItem
    {...item}
    addSelectedExercises={addSelectedExercises}
    deleteSelectedExercises={deleteSelectedExercises}
    deleteExercise={deleteExercise}
  />
);

export default function AddNewExerciseModalScreen({ navigation }) {
  const [text, onChangeText] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => console.log(selected)}
          accessibilityLabel="Go back to previous screen"
        />
      ),
    });
  }, [navigation]);

  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM exercises", [], (_, { rows }) =>
      setExercises(rows._array)
    );
  });

  const addExercise = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO exercises (name) VALUES (?)`,
        [text],
        (tx, res) => {
          console.log(res);
        }
      );

      tx.executeSql(
        `SELECT * FROM exercises`,
        [],
        (err, res) => {
          setExercises(res.rows._array);
        },
        (err) => console.log(err)
      );
    });

    // setExercises([...exercises, { id: Date.now(), title: text }]);
  };

  const addSelectedExercises = (action: boolean, id: number) => {
    if (action) {
      setSelected([...selected, id]);
      return;
    }

    const set = new Set(selected);
    set.delete(id);
    setSelected([...set]);
  };

  const deleteSelectedExercises = (id: number) => {
    const set = new Set(selected);
    set.delete(id);

    setSelected([...set]);
    // setSelectedExercises(
    //   selectedExercises.filter((exercise) => exercise.id !== id)
    // );
  };

  const deleteExercise = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM exercises WHERE id = ?`,
        [id],
        (tx, res) => {
          console.log(res);
        },
        (err) => console.log(err)
      );

      console.log(id);

      tx.executeSql(
        `SELECT * FROM exercises`,
        [],
        (err, res) => {
          setExercises(res.rows._array);
        },
        (err) => console.log(err)
      );
    });
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
            addSelectedExercises,
            deleteSelectedExercises,
            deleteExercise,
          })
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
