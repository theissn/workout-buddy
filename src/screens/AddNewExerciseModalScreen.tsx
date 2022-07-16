import { useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

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

function ListItem({
  id,
  title,
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
          onPressIn={() => addSelectedExercises(id)}
          onPressOut={() => deleteSelectedExercises(id)}
        />
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
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState(initialExercises);

  const addExercise = () => {
    setExercises([...exercises, { id: Date.now(), title: text }]);
    onChangeText("");
  };

  const addSelectedExercises = (id: number) => {
    setSelectedExercises([
      ...selectedExercises,
      exercises.find((exercise) => exercise.id === id),
    ]);

    console.log(selectedExercises);
  };

  const deleteSelectedExercises = (id: number) => {
    setSelectedExercises(
      selectedExercises.filter((exercise) => exercise.id !== id)
    );

    console.log(selectedExercises);
  };

  const deleteExercise = (id: number) =>
    setExercises(exercises.filter((exercise) => exercise.id !== id));

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
