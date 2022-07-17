import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableHighlight, Button } from "react-native";
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
      "SELECT * FROM workouts w LEFT JOIN routines r ON r.id = w.routineId",
      [],
      (_, { rows: { _array } }) => {
        setExercises(_array);
      }
    );
  });
}

function ListItem({ item: { id, name, startedAt, routineId }, editWorkout }) {
  return (
    <TouchableHighlight onPress={() => editWorkout(routineId, id)}>
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
            flex: 2,
          }}
        >
          <Text>{name}</Text>
          <Text style={{ fontSize: 12, paddingTop: 5 }}>{startedAt}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <Text>✍️</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const renderItem = (props) => <ListItem {...props} />;

export default function WorkoutsScreen({ navigation, route }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const { update = false } = route.params ?? {};

  useEffect(() => {
    getWorkouts(setWorkouts);
  }, [update]);

  if (workouts.length === 0) {
    return (
      <View style={{ padding: 20 }}>
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

  return (
    <View>
      <FlatList
        data={workouts}
        renderItem={({ item }) => renderItem({ item, editWorkout })}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
