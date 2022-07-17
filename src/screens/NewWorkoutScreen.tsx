import { format } from "date-fns";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import SetTracker from "../components/workouts/SetTracker";
import { db } from "../helpers/db";
import { styles } from "../styles/global";

function groupBy(array, key) {
  return array
    .reduce((result, obj) => {
      (result[obj[key]] = result[obj[key]] || []).push(obj);
      return result;
    }, [])
    .filter(Boolean);
}

export default function NewWorkoutScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [routine, setRoutine] = useState();
  const [exercises, setExercises] = useState([]);

  const [sets, setSets] = useState([]);

  const startedAt = new Date();

  const { id, workoutId } = route.params ?? {};

  function saveWorkout() {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO workouts (routineId, startedAt, endedAt) VALUES (?, ?, ?)`,
        [
          routine.id,
          format(startedAt, "yyyy-MM-dd HH:mm:ss"),
          format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        ],
        (_, { insertId }) => {
          for (const [index, exerciseSets] of sets.entries()) {
            exerciseSets.forEach((set) => {
              tx.executeSql(
                `INSERT INTO workouts_exercises (workoutId, exerciseId, weight, reps) VALUES (?, ?, ?, ?)`,
                [
                  insertId,
                  exercises.find((_, idx) => idx === index)?.id,
                  set.weight,
                  set.reps,
                ]
              );
            });
          }
        }
      );
    });
  }

  function updateWorkout() {
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM workouts_exercises WHERE workoutId = ?`, [
        workoutId,
      ]);

      for (const [index, exerciseSets] of sets.entries()) {
        exerciseSets.forEach((set) => {
          tx.executeSql(
            `INSERT INTO workouts_exercises (workoutId, exerciseId, weight, reps) VALUES (?, ?, ?, ?)`,
            [
              workoutId,
              exercises.find((_, idx) => idx === index)?.id,
              set.weight,
              set.reps,
            ]
          );
        });
      }
    });
  }

  function handleSetUpdate(index: number, newSets) {
    const map = new Map<number, Array<{ weight: string; reps: string }>>(
      sets.map((set, index) => [index, set])
    );

    map.set(index, newSets);
    setSets([...map.values()]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: routine ? routine.name : "New Workout",
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => {
            workoutId ? updateWorkout() : saveWorkout();

            navigation.navigate({
              name: "Workouts",
              params: { update: Math.random().toFixed(10) },
              merge: true,
            });
          }}
        />
      ),
    });
  }, [navigation, routine, sets]);

  useEffect(() => {
    if (id) return;

    navigation.navigate("NewWorkoutModal");
  }, [id]);

  useEffect(() => {
    if (!id) return;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM routines WHERE id = ?",
        [id],
        (_, { rows: { _array } }) => {
          setRoutine(_array[0]);

          tx.executeSql(
            `SELECT e.* FROM routine_exercises r LEFT JOIN exercises e ON e.id = r.exerciseId WHERE r.routineId = ?`,
            [id],
            (_, { rows: { _array } }) => {
              if (!workoutId)
                setSets(_array.map((e) => [{ weight: "0", reps: "0" }]));

              setExercises(_array);
              setLoading(false);
            }
          );
        }
      );
    });
  }, [id]);

  useEffect(() => {
    if (!workoutId) return;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM workouts_exercises WHERE workoutId = ?",
        [workoutId],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) setSets(groupBy(_array, "exerciseId"));
        }
      );
    });
  }, [workoutId]);

  useEffect(() => {
    if (sets.length > 0) return;

    setSets(exercises.map((e) => [{ weight: "0", reps: "0" }]));
  }, [exercises]);

  if (isLoading || !routine || !exercises) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
          <Text style={{ fontSize: 30 }}>{routine.name}</Text>
          <View
            style={{
              borderBottomColor: "#000",
              width: 35,
              borderBottomWidth: 1,
              paddingTop: 5,
            }}
          />
          <Text style={{ fontSize: 20, paddingTop: 10, fontWeight: "300" }}>
            {format(startedAt, "do MMM, H:mm")}
          </Text>
          {exercises.map((exercise, index) => (
            <View key={exercise.id}>
              <View style={{ paddingTop: 30 }} />
              <Text style={{ fontSize: 20 }}>{exercise.name}</Text>
              <View style={{ paddingTop: 10 }} />
              {sets[index] && (
                <SetTracker
                  sets={sets[index]}
                  handleSetUpdate={(sets) => handleSetUpdate(index, sets)}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
