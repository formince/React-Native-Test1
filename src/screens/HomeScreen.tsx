import React from "react";
import { View, Text, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Merhaba! React Native öğreniyoruz.</Text>
      <Button title="Profile Git" onPress={() => navigation.navigate("Profile")} />
    </View>
  );
}
