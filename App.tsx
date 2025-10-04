import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useUserLocation } from "./hook/useUserLocation";

type PollinationViewProps = {
  chance: number;
};

export default function App() {
  const { location } = useUserLocation();
  const mapRef = useRef<MapView>(null);

  const [data, setData] = useState<any[]>([]);

  function PollinationView({ chance }: PollinationViewProps) {
    // Define a cor com base na chance
    const getColor = () => {
      if (chance >= 0.75) return "#4caf50"; // verde alto
      if (chance >= 0.5) return "#ffeb3b"; // amarelo médio
      if (chance >= 0.25) return "#ff9800"; // laranja baixo
      return "#f44336"; // vermelho muito baixo
    };

    return (
      <View style={[styles.containerMarker, { backgroundColor: getColor() }]}>
        {/* <Text style={styles.text}>{Math.round(chance * 100)}%</Text> */}
      </View>
    );
  }

  function getPollinationChance(feature: any) {
    const directions = ["North", "South", "East", "West"];
    let chance = 0;

    directions.forEach((dir) => {
      const classifications =
        feature.properties[`landcovers${dir}Classifications`];
      if (!classifications) return;

      const matches = classifications.matchAll(/(\d+)%.*?MUC (\d+)/g);
      for (const match of matches) {
        const percent = parseInt(match[1]);
        const muc = parseInt(match[2]);

        if ([43, 1].includes(muc)) chance += (percent / 100) * 1; // plantas
        if ([91, 93].includes(muc)) chance += (percent / 100) * 0.1; // urbano
      }
    });

    return Math.min(chance / 4, 1);
  }

  async function getLocations() {
    try {
      const url =
        "https://api.globe.gov/search/v1/measurement/protocol/measureddate/country/?protocols=vegatation_covers&startdate=2023-05-05&enddate=2025-05-05&countrycode=BRA&geojson=TRUE&sample=TRUE";

      const response = await fetch(url);

      const json = await response.json();
      console.log(json);

      setData(json.features);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getLocations();
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={{
          borderWidth: 1,
          borderColor: "red",
        }}
      >
        Open up App.js to start working on your app!
      </Text>
      <MapView
        style={StyleSheet.absoluteFillObject}
        ref={mapRef}
        mapType="satellite"
        zoomControlEnabled
        provider={PROVIDER_GOOGLE}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <View style={styles.userMarker} />
          </Marker>
        )}

        {data.map((feature, index) => {
          const [lon, lat] = feature.geometry.coordinates;
          const chance = (feature.properties.pollinationChance ?? 0) / 100;
          console.log(feature.properties);

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: lat,
                longitude: lon,
              }}
              title={feature.properties.siteName}
              description={`Elevação: ${feature.properties.elevation}m`}
            >
              <PollinationView chance={getPollinationChance(feature)} />
            </Marker>
          );
        })}
      </MapView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FDBB46",
    borderWidth: 2,
    borderColor: "white",
  },
  bottomPanelContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    gap: 8,
  },
  toggleButton: {
    backgroundColor: "#FDBB46", // primaryPure
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  detailPanel: {
    backgroundColor: "#FDBB46",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  driverInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 24,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  driverInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  driverName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  driverPlate: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  notStartedBox: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E2E2", // shapeTertiary
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  notStartedImage: {
    width: 88,
    height: 88,
  },
  notStartedTextBox: {
    alignItems: "center",
  },
  notStartedText: {
    fontWeight: "500",
    color: "#000", // textPrimary
  },
  notStartedSubText: {
    textAlign: "center",
    color: "#000",
  },
  initiateButton: {
    paddingHorizontal: 16,
    width: "100%",
  },
  routeButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginTop: "auto",
    paddingHorizontal: 16,
  },
  routeButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  routeButtonIconContainer: {
    backgroundColor: "#FFF1C6", // warningLight
    borderRadius: 999,
    padding: 8,
  },
  routeButtonText: {
    color: "#000",
    marginTop: 4,
  },
  containerMarker: {
    width: 24,
    height: 24,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
