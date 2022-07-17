import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

// Array<{weight: string; reps: string}>

export default function SetTracker({ sets, handleSetUpdate }) {
  function addSet() {
    handleSetUpdate([...sets, sets[sets.length - 1]]);
  }

  function deleteSet(index: number) {
    handleSetUpdate(sets.filter((_, i) => i !== index));
  }

  function updateValue(index: number, value: string, key: string) {
    const map = new Map<number, { weight: string; reps: string }>(
      sets.map((set, index) => [index, set])
    );

    map.set(index, { ...map.get(index), [key]: value });
    handleSetUpdate([...map.values()]);
  }

  return (
    <>
      {sets.map((set, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#fff",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: "#000",
            borderBottomWidth: 0.25,
          }}
        >
          <Text style={{ color: "#000", flex: 0.5 }}>{index + 1}</Text>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={set.weight}
              onChange={(e) => updateValue(index, e.nativeEvent.text, "weight")}
              style={{
                backgroundColor: "#eee",
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            />
            <Text style={{ paddingLeft: 5 }}>kg</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={set.reps}
              onChange={(e) => updateValue(index, e.nativeEvent.text, "reps")}
              style={{
                backgroundColor: "#eee",
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            />
            <Text style={{ paddingLeft: 5 }}>reps</Text>
          </View>

          <View
            style={{
              flex: 0.5,
              alignItems: "flex-end",
            }}
          >
            {index !== 0 && (
              <Button onPress={() => deleteSet(index)} title="🗑" />
            )}
          </View>
        </View>
      ))}
      <TouchableHighlight
        onPress={addSet}
        style={{
          width: "100%",
          backgroundColor: "#000",
          padding: 10,
        }}
      >
        <Text style={{ color: "#fff" }}>+ Add Set</Text>
      </TouchableHighlight>
    </>
  );
}
