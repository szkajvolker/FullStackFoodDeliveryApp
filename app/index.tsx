import "./global.css";
import { Text, View } from "react-native";

export default function index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl text-center font-bold  text-primary font-quicksand-bold">
        Welcome to my React Native App
      </Text>
    </View>
  );
}
