import React from "react";
import { useUser, useClerk } from "@clerk/expo";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary mb-6">
        Settings
      </Text>

      {/* User profile card */}
      <View className="rounded-2xl border border-border bg-card p-5 gap-4">
        <View className="flex-row items-center gap-4">
          <Image source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar} className="size-14 rounded-full" />
          <View className="flex-1">
            <Text className="text-lg font-sans-bold text-primary">
              {user?.firstName || "User"}
            </Text>
            <Text className="text-sm font-sans-medium text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Sign out */}
      <TouchableOpacity
        className="mt-5 items-center rounded-2xl border border-destructive/30 bg-destructive/10 py-4"
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Text className="text-base font-sans-bold text-destructive">
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
