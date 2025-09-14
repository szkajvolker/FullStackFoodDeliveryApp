import { View, Text, Button } from "react-native";
import React from "react";
import { router } from "expo-router";

const signup = () => {
  return (
    <View>
      <Text>signup</Text>
      <Button title="Sign Up" onPress={() => router.push("/sign-in")}></Button>
    </View>
  );
};

export default signup;
