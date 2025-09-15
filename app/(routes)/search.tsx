import { Text, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import seed from "@/lib/seed";

const search = () => {
  return (
    <SafeAreaView>
      <Text>search</Text>

      <Button
        title="Seed"
        onPress={() => seed().catch((error) => console.log("Failed to seed the database.", error))}
      />
    </SafeAreaView>
  );
};

export default search;
