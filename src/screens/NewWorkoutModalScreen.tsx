import { useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

interface Exercise {
  id: number;
  title: string;
}

const initialExercises: Exercise[] = [
  {
    id: 1,
    title: "Squats",
  },
  {
    id: 2,
    title: "Bench Press",
  },
  {
    id: 3,
    title: "Military Press",
  },
  {
    id: 4,
    title: "Deadlift",
  },
];

function ListItem({ id, title }) {
  return (
    <TouchableHighlight onPress={() => null}>
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
        <Text>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

const renderItem = ({ item }) => <ListItem {...item} />;

export default function NewWorkoutModalScreen({ navigation }) {
  const [text, onChangeText] = useState("");
  const [exercises, setExercises] = useState(initialExercises);

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
      <TextInput
        style={{
          backgroundColor: "#fff",
          paddingVertical: 15,
          paddingHorizontal: 12.5,
        }}
        placeholder={`Filter routines...`}
        onChangeText={onChangeText}
        value={text}
      />
      <View style={{ padding: 10 }} />
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
