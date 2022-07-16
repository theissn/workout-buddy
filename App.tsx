import { Button, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewWorkoutScreen from "./src/screens/NewWorkoutScreen";
import RoutinesScreen from "./src/screens/RoutinesScreen";
import WorkoutsScreen from "./src/screens/WorkoutsScreen";
import NewRoutinesScreen from "./src/screens/NewRoutinesScreen";
import AddNewExerciseModalScreen from "./src/screens/AddNewExerciseModalScreen";
import NewWorkoutModalScreen from "./src/screens/NewWorkoutModalScreen";

const WorkoutsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function WorkoutsStackScreen() {
  return (
    <WorkoutsStack.Navigator screenOptions={{ headerShown: true }}>
      <WorkoutsStack.Group>
        <WorkoutsStack.Screen
          name="Workouts"
          component={WorkoutsScreen}
          options={({ navigation, route }) => ({
            headerRight: () => (
              <Button
                title="New"
                onPress={() => navigation.navigate("NewWorkoutModal")}
                accessibilityLabel="Start new workout"
              />
            ),
          })}
        />
        <WorkoutsStack.Screen
          name="NewWorkout"
          component={NewWorkoutScreen}
          options={({ navigation, route }) => ({
            title: "X Workout",
          })}
        />
      </WorkoutsStack.Group>
      <WorkoutsStack.Group screenOptions={{ presentation: "modal" }}>
        <WorkoutsStack.Screen
          name="NewWorkoutModal"
          component={NewWorkoutModalScreen}
          options={({ navigation, route }) => ({
            title: "Start New Workout",
            headerLeft: () => (
              <Button
                title="Close"
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back to previous screen"
              />
            ),
          })}
        />
      </WorkoutsStack.Group>
    </WorkoutsStack.Navigator>
  );
}

function RoutinesStackScreen() {
  return (
    <WorkoutsStack.Navigator screenOptions={{ headerShown: true }}>
      <WorkoutsStack.Group>
        <WorkoutsStack.Screen
          name="Routines"
          component={RoutinesScreen}
          options={({ navigation, route }) => ({
            headerRight: () => (
              <Button
                title="New"
                onPress={() => navigation.navigate("NewRoutine")}
                accessibilityLabel="Create new routine"
              />
            ),
          })}
        />
        <WorkoutsStack.Screen
          name="NewRoutine"
          component={NewRoutinesScreen}
          options={({ navigation, route }) => ({
            title: "New Routine",
            headerRight: () => (
              <Button
                title="Save"
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back to previous screen"
              />
            ),
          })}
        />
      </WorkoutsStack.Group>
      <WorkoutsStack.Group screenOptions={{ presentation: "modal" }}>
        <WorkoutsStack.Screen
          name="AddNewExerciseModal"
          component={AddNewExerciseModalScreen}
          options={({ navigation, route }) => ({
            title: "Add New Exercise",
            headerLeft: () => (
              <Button
                title="Close"
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back to previous screen"
              />
            ),
            headerRight: () => (
              <Button
                title="Save"
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back to previous screen"
              />
            ),
          })}
        />
      </WorkoutsStack.Group>
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
          options={{
            headerShown: false,
            tabBarIcon: () => <Text>🏋️‍♀️</Text>,
            title: "Workouts",
          }}
        />
        <Tab.Screen
          name="RoutinesTab"
          component={RoutinesStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => <Text>✍️</Text>,
            title: "Routines",
          }}
        />
        <Tab.Screen
          name="Settings"
          component={RoutinesScreen}
          options={{
            headerShown: true,
            tabBarIcon: () => <Text>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
