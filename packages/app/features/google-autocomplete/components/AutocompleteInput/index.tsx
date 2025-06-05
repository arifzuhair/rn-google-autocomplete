import { ThemedText } from "@/components/ThemedText";
import { useAppSelector } from "@/hooks/useStoreHook";
import {
  findPlaces,
  findPlacesDetails,
  setIsSearching,
} from "@/packages/app/redux/placesSlice";
import { AppDispatch } from "@/packages/app/store";
import { debounce } from "@/packages/app/utils";
import { SearchBar as AntSearchBar } from "@ant-design/react-native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

export function AutocompleteInput() {
  const dispatch: AppDispatch = useDispatch();

  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { results } = useAppSelector(({ places }) => places);

  const debouncedDispatch = debounce(
    async (input: string) => await dispatch(findPlaces(input)),
    500
  );

  const handleInputChange = useCallback(
    async (input: string) => {
      setInput(input);
      dispatch(setIsSearching(true));
      if (input) {
        debouncedDispatch(input);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    },
    [dispatch, debouncedDispatch]
  );

  const handleInputClear = useCallback(() => {
    setInput("");
    setShowResults(false);
  }, []);

  const handleOnPress = useCallback(
    (description: string, id: string) => async () => {
      setInput(description);
      setShowResults(false);
      await dispatch(findPlacesDetails(id));
    },
    []
  );

  return (
    <View style={styles.container}>
      <AntSearchBar
        autoCorrect={false}
        value={input}
        placeholder="Where are you going?"
        onCancel={handleInputClear}
        onChange={handleInputChange}
      />
      {showResults && results.length > 0 && (
        <View style={styles.popoverContainer}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            {results.map((result, index) => (
              <TouchableOpacity
                key={result.place_id}
                style={[
                  styles.resultItem,
                  index === results.length - 1 ? styles.lastResultItem : null,
                ]}
                onPress={handleOnPress(result.description, result.place_id)}
              >
                <ThemedText style={{ fontSize: 14 }}>
                  {result.structured_formatting.main_text}
                </ThemedText>
                <ThemedText style={{ fontSize: 12 }}>
                  {result.structured_formatting.secondary_text}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
  },
  popoverContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 8,
    maxHeight: 250,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  scrollView: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "column",
    gap: "8px",
  },
  lastResultItem: {
    borderBottomWidth: 0,
  },
  resultText: {
    fontSize: 14,
    color: "#333",
  },
  loadingText: {
    padding: 12,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
