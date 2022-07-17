import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { db } from "../helpers/db";

interface Workout {
  id: number;
  title: string;
  date: string;
}

function getWorkouts(
  setExercises: React.Dispatch<React.SetStateAction<Workout[]>>
) {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT w.*, r.name FROM workouts w LEFT JOIN routines r ON r.id = w.routineId ORDER BY w.startedAt DESC",
      [],
      (_, { rows: { _array } }) => {
        setExercises(_array);
      }
    );
  });
}

function ListItem({
  item: { id, name, startedAt, routineId },
  editWorkout,
  deleteWorkout,
}) {
  return (
    <View
      style={{
        padding: 20,
        borderColor: "#000",
        borderBottomWidth: 0.25,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fefefe",
      }}
    >
      <View
        style={{
          flex: 4,
        }}
      >
        <Text>{name}</Text>
        <Text style={{ fontSize: 12, paddingTop: 5 }}>{startedAt}</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "flex-end",
          flexDirection: "row",
        }}
      >
        <Button onPress={() => editWorkout(routineId, id)} title="✍️" />
        <Button onPress={() => deleteWorkout(id)} title="🗑" />
      </View>
    </View>
  );
}

const renderItem = (props) => <ListItem {...props} />;

export default function WorkoutsScreen({ navigation, route }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const { update } = route.params ?? {};

  useEffect(() => {
    getWorkouts(setWorkouts);
  }, [update]);

  if (workouts.length === 0) {
    return (
      <View
        style={{
          padding: 20,
        }}
      >
        <Text>
          Start your first workout by clicking the new workout button in the top
          right hand corner
        </Text>
      </View>
    );
  }

  function editWorkout(routineId: number, workoutId: number) {
    navigation.navigate("NewWorkout", {
      id: routineId,
      workoutId,
    });
  }

  function deleteWorkout(id: number) {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => {
            db.transaction((tx) => {
              tx.executeSql("DELETE FROM workouts WHERE id = ?", [id]);
              tx.executeSql(
                "DELETE FROM workouts_exercises WHERE workoutId = ?",
                [id]
              );
            });

            getWorkouts(setWorkouts);
          },
        },
      ]
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 25,
      }}
    >
      <FlatList
        data={workouts}
        renderItem={({ item }) =>
          renderItem({ item, editWorkout, deleteWorkout })
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
