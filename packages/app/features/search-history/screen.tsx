import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@ant-design/react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSearchHistory } from "./SearchHistory.hook";

const styles = StyleSheet.create({
  noHistoryContainer: {
    flex: 1,
    flexDirection: "column",
    gap: "40px",
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    flex: 1,
    flexDirection: "column",
  },
  historyItemWrapper: {
    flexDirection: "row",
    gap: "8px",
    alignItems: "center",
  },
  historyItem: {
    flexDirection: "column",
    gap: "4px",
  },
  historyItemTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  historyItemAddress: {
    fontSize: 12,
  },
});

const COPY = {
  title: "Search History",
  noHistory: "Seems like you don't have any search history",
};

type NoHistoryProps = Readonly<{
  handleBack: () => void;
}>;

const NoHistory = ({ handleBack }: NoHistoryProps) => {
  return (
    <ThemedView style={styles.noHistoryContainer}>
      <MaterialCommunityIcons name="delete-empty" size={50} color="black" />
      <ThemedText>{COPY.noHistory}</ThemedText>
      <Button title="Back" onPress={handleBack} />
    </ThemedView>
  );
};

type HistoryItemProps = Readonly<{
  title: string;
  address: string;
  isLastItem?: boolean;
}>;

const HistoryItem = ({ title, address, isLastItem }: HistoryItemProps) => {
  return (
    <View
      key={title}
      style={{
        flexDirection: "row",
        gap: 8,
        padding: 10,
        borderBottomWidth: isLastItem ? 0 : 0.5,
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="history"
        size={24}
        color="black"
        style={{ alignSelf: "flex-start" }}
      />
      <View style={{ flexDirection: "column" }}>
        <ThemedText style={styles.historyItemTitle}>{title}</ThemedText>
        <ThemedText style={styles.historyItemAddress}>{address}</ThemedText>
      </View>
    </View>
  );
};

export function SearchHistoryScreen() {
  const router = useRouter();
  const { hasHistory, history: historyList } = useSearchHistory();

  const handleBack = useCallback(() => {
    router.navigate({ pathname: "/" });
  }, [router]);

  return (
    <ThemedView style={styles.historyContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View></View>
        <TouchableOpacity
          onPress={handleBack}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: "#fff",
          }}
        >
          <MaterialCommunityIcons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {!hasHistory && <NoHistory handleBack={handleBack} />}
        {historyList.map((history, index) => (
          <HistoryItem
            key={history.place_id}
            title={history.structured_formatting.main_text}
            address={history.structured_formatting.secondary_text}
            isLastItem={index === historyList.length - 1}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}
