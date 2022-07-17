import { format } from "date-fns";
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
    tx.executeSql("SELECT * FROM workouts", [], (_, { rows: { _array } }) => {
      setExercises(_array);
    });
  });
}

function ListItem({ id, title, date }) {
  return (
    <TouchableHighlight onPress={() => console.log(id)}>
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
            flex: 1,
          }}
        >
          <Text>
            {date} - {title}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <Text>➡️</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const renderItem = ({ item }: any) => <ListItem {...item} />;

export default function WorkoutsScreen({ navigation }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    getWorkouts(setWorkouts);
  }, []);

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

  return (
    <View>
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
