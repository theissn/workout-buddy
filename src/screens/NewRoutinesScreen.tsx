import { useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  Touchable,
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
];

function ListItem({ id, title, deleteExercise }) {
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
        <Text>{title}</Text>
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

const renderItem = ({ item, deleteExercise }) => (
  <ListItem {...item} deleteExercise={deleteExercise} />
);

export default function NewRoutinesScreen({ navigation }) {
  const [text, onChangeText] = useState("");
  const [exercises, setExercises] = useState(initialExercises);

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
