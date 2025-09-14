import { View, Text, Button } from "react-native";
import React from "react";
import { router } from "expo-router";

const signin = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Button title="Sign In" onPress={() => router.push("/sign-up")}></Button>
    </View>
  );
};

export default signin;
