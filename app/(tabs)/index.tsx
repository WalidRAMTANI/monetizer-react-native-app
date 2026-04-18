import ListHeader from "@/components/ListHeader";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpCommingSubscriptionCard from "@/components/UpCommingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";

import dayjs from "dayjs";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";

export default function App() {
  const { user } = useUser();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Show the user's first name, or fall back to the static name
  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="flex-1">
        <FlatList
          contentContainerClassName="pb-20"
          ListHeaderComponent={() => (
            <>
              <View className="home-header">
                <View className="home-user">
                  <Image source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar} className="home-avatar" />
                  <Text className="home-user-name">{displayName}</Text>
                </View>
                <Image source={icons.add} className="home-add-icon" />
              </View>

              <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>
                <View className="home-balance-row">
                  <Text className="home-balance-amount">
                    {formatCurrency(HOME_BALANCE.amount)}
                  </Text>
                  <Text className="home-balance-date">
                    {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                  </Text>
                </View>
              </View>

              <View>
                <ListHeader title="Upcoming" />
                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  renderItem={({ item }) => (
                    <UpCommingSubscriptionCard {...item} />
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text className="home-empty-state">
                      {" "}
                      No Upcoming renewals yet.
                    </Text>
                  }
                />
              </View>
              <ListHeader title="All Subscriptions" />
            </>
          )}
          data={HOME_SUBSCRIPTIONS}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedId === item.id}
              onPress={() => {
                setExpandedId(item.id === expandedId ? null : item.id);
              }}
            />
          )}
          extraData={expandedId}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">
              No Upcoming Subscriptions yet.
            </Text>
          }
          ItemSeparatorComponent={() => <View className="h-4" />}
        />
      </View>
    </SafeAreaView>
  );
}
