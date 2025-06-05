import { ThemedView } from "@/components/ThemedView";
import { useAppSelector } from "@/hooks/useStoreHook";
import { Button } from "@ant-design/react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { AutocompleteInput } from "./components/AutocompleteInput";
import { GoogleMapWrapper } from "./components/Map";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export function GoogleAutocompleteScreen() {
  const router = useRouter();

  const { isSearching } = useAppSelector(({ places }) => places);

  const toHistory = useCallback(
    () => router.push({ pathname: "/history" }),
    [router]
  );

  return (
    <ThemedView style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: 50,
          right: 10,
          zIndex: 1,
          opacity: !isSearching ? 0 : 1,
        }}
      >
        <Button onPress={toHistory}>
          <MaterialCommunityIcons name="history" size={24} color="black" />
        </Button>
      </View>
      <AutocompleteInput />
      <GoogleMapWrapper />
    </ThemedView>
  );
}
