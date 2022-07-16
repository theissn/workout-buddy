import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import NewWorkoutScreen from "./src/screens/NewWorkoutScreen";
import WorkoutsScreen from "./src/screens/WorkoutsScreen";

function RoutinesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Coming soon to a theater near you...</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const WorkoutsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function WorkoutsStackScreen() {
  return (
    <WorkoutsStack.Navigator screenOptions={{ headerShown: true }}>
      <WorkoutsStack.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={({ navigation, route }) => ({
          headerRight: () => (
            <Button
              title="➕"
              onPress={() => navigation.navigate("NewWorkout")}
            />
          ),
        })}
      />
      <WorkoutsStack.Screen name="NewWorkout" component={NewWorkoutScreen} />
    </WorkoutsStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="WorkoutsTab"
          component={WorkoutsStackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Routines" component={RoutinesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
