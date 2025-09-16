import { View, Text } from "react-native";

const EmptyCart = () => {
  return (
    <View className="flex-1 justify-center items-center mt-80">
      <Text className="text-primary text-2xl">Your Cart is empty</Text>
      <Text className="text-5xl">🛒</Text>
    </View>
  );
};

export default EmptyCart;
