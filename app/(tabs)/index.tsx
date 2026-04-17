import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding">
        <Text className="text-blue-500 underline">Go to onboarding</Text>
      </Link>
      <Link href="/sign-in">
        <Text className="text-blue-500 underline">Go to Sign In</Text>
      </Link>
      <Link href="/sign-up">
        <Text className="text-blue-500 underline">Go to Sign Up</Text>
      </Link>
    </SafeAreaView>
  );
}
