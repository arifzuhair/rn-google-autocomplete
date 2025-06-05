import { ThemedView } from "@/components/ThemedView";
import { useAppSelector } from "@/hooks/useStoreHook";
import { useLayoutEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export function GoogleMapWrapper() {
  const mapRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: 3.1267706,
        longitude: 101.644,
        latitudeDelta: 3.127921880291502 - 3.125223919708498,
        longitudeDelta: 101.6791165802915 - 101.6764186197085,
      });
    }
  });

  const { selectedPlace } = useAppSelector(({ places }) => places);
  return (
    <ThemedView style={styles.container}>
      <MapView
        showsCompass
        ref={mapRef}
        key={`${selectedPlace?.latitude}-${selectedPlace?.longitude}`}
        style={styles.map}
        region={selectedPlace}
        initialRegion={{
          latitude: 3.1267706,
          longitude: 101.644,
          latitudeDelta: 3.127921880291502 - 3.125223919708498,
          longitudeDelta: 101.6791165802915 - 101.6764186197085,
        }}
      >
        {selectedPlace && (
          <Marker
            coordinate={{
              latitude: selectedPlace.latitude,
              longitude: selectedPlace.longitude,
            }}
          />
        )}
      </MapView>
    </ThemedView>
  );
}
