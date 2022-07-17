import { openDatabase } from "expo-sqlite";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  Touchable,
  TouchableHighlight,
  View,
} from "react-native";
import { db } from "../helpers/db";

interface Exercise {
  id: number;
  title: string;
}

function ListItem({ id, name, deleteExercise }) {
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
        <Button onPress={() => deleteExercise(id)} title="🗑" />
      </View>
    </View>
  );
}

const renderItem = ({ item, deleteExercise }) => (
  <ListItem {...item} deleteExercise={deleteExercise} />
);

export default function NewRoutinesScreen({ navigation, route }) {
  const [text, onChangeText] = useState("");
  const [exercises, setExercises] = useState([]);

  const { selected = [] } = route.params ?? {};

  const { id = null } = route.params ?? {};

  useEffect(() => {
    if (!id) return;

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM routines WHERE id = ?`,
        [id],
        (_, { rows: { _array } }) => {
          onChangeText(_array?.[0]?.name ?? "");
        }
      );

      tx.executeSql(
        `SELECT e.* FROM routine_exercises r LEFT JOIN exercises e ON e.id = r.exerciseId WHERE r.routineId = ?`,
        [id],
        (err, { rows: { _array } }) => {
          const values = new Map(
            [...exercises, ...selected, ..._array].map((item) => [
              item.id,
              item,
            ])
          ).values();

          setExercises([...values]);
        }
      );
    });
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id ? "Edit Routine" : "New Routine",
      headerRight: () => (
        <Button
          title="Save"
          onPress={saveRoutine}
          accessibilityLabel="Go back to previous screen"
        />
      ),
    });
  }, [navigation, exercises, text]);

  useEffect(() => {
    if (selected.length === 0) return;

    const values = new Map(
      [...exercises, ...selected].map((item) => [item.id, item])
    ).values();

    setExercises([...values]);
  }, [route.params?.selected]);

  const saveRoutine = () => {
    if (id) {
      db.transaction((tx) => {
        tx.executeSql(`DELETE FROM routine_exercises WHERE routineId = ?`, [
          id,
        ]);

        tx.executeSql(
          `UPDATE routines SET name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
          [text, id]
        );

        for (const exercise of exercises) {
          tx.executeSql(
            `INSERT INTO routine_exercises (routineId, exerciseId) VALUES (?, ?)`,
            [id, exercise.id]
          );
        }
      });

      navigation.navigate({
        name: "Routines",
        params: {
          update: true,
        },
        merge: true,
      });
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO routines (name) VALUES (?)`,
        [text],
        (_, { insertId }) => {
          for (const exercise of exercises) {
            tx.executeSql(
              `INSERT INTO routine_exercises (routineId, exerciseId) VALUES (?, ?)`,
              [insertId, exercise.id]
            );
          }
        }
      );
    });

    navigation.navigate({
      name: "Routines",
      params: {
        update: true,
      },
      merge: true,
    });
  };

  const deleteExercise = (id: number) =>
    setExercises(exercises.filter((exercise) => exercise.id !== id));

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
      <TextInput
        style={{
          backgroundColor: "#fff",
          paddingVertical: 15,
          paddingHorizontal: 12.5,
        }}
        placeholder={`Routine Name`}
        onChangeText={onChangeText}
        value={text}
      />
      <View style={{ paddingTop: 20 }} />
      <Text
        style={{
          fontSize: 20,
          paddingBottom: 10,
        }}
      >
        Exercises
      </Text>
      <FlatList
        data={exercises}
        renderItem={({ item }) => renderItem({ item, deleteExercise })}
        keyExtractor={(item) => item.id}
      />
      <TouchableHighlight
        onPress={() => navigation.navigate("AddNewExerciseModal")}
        accessibilityHint="Add new exercise"
        style={{
          paddingVertical: 15,
          paddingHorizontal: 12.5,
          backgroundColor: "#000",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff" }}>Add exercise</Text>
      </TouchableHighlight>
      {/* <Button onPress={() => deleteExercise(id)} title="" /> */}
    </View>
  );
}
