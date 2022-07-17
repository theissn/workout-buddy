import { format } from "date-fns";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
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

export default function NewWorkoutScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [routine, setRoutine] = useState();
  const [exercises, setExercises] = useState([]);

  const startedAt = new Date();

  const { id } = route.params ?? {};

  useLayoutEffect(() => {
    navigation.setOptions({
      title: routine ? routine.name : "New Workout",
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => {
            // TODO: save workout
            navigation.navigate({
              name: "Workouts",
              params: { update: 1 },
              merge: true,
            });
          }}
        />
      ),
    });
  }, [navigation, routine]);

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
              setExercises(_array);
              setLoading(false);
            }
          );
        }
      );
    });
  }, [id]);

  if (isLoading || !routine || !exercises) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
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
        {exercises.map((exercise) => (
          <View key={exercise.id}>
            <View style={{ paddingTop: 30 }} />
            <Text style={{ fontSize: 20 }}>{exercise.name}</Text>
            <View style={{ paddingTop: 10 }} />
            <SetTracker />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
