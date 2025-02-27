import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomePage from "../screens/WelcomePage";
import LoginScreen from "../screens/LoginScreen";
import StudentDashboard from "../screens/StudentDashboard";
import TeacherDashboard from "../screens/TeacherDashboard";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="StudentDashboard" 
        component={StudentDashboard}
        options={{ 
          title: 'Öğrenci Paneli',
          headerLeft: () => null 
        }}
      />
      <Stack.Screen 
        name="TeacherDashboard" 
        component={TeacherDashboard}
        options={{ 
          title: 'Öğretmen Paneli',
          headerLeft: () => null 
        }}
      />
    </Stack.Navigator>
  );
}
