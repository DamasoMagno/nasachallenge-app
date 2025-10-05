import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeClosedIcon, EyeIcon, RssIcon } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserLocation } from "../hook/useUserLocation";
import { api } from "../services/api"; // 1. IMPORTANDO SUA INSTÂNCIA DO AXIOS (ajuste o caminho se necessário)

type HeatmapPoint = {
  latitude: number;
  longitude: number;
  weight: number;
};

export function Home() {
  const navigation = useNavigation();
  const { location } = useUserLocation();

  const mapRef = useRef<MapView>(null);

  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  async function fetchBeeMapData(lat: number, lon: number) {
    setIsLoading(true);
    setHeatmapData([]);
    try {
      console.log(`Buscando mapa de abelhas no backend via Axios...`);

      const response = await api.get("/api/bee-map", {
        params: { lat, lon }, // Axios envia parâmetros GET desta forma
      });

      setHeatmapData(response.data);
    } catch (error) {
      console.error(error);
      alert(
        "Não foi possível conectar ao backend. Verifique o IP e se o servidor está rodando."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (location) {
      fetchBeeMapData(location.coords.latitude, location.coords.longitude);
    }
  }, [location]);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <MapView
        style={StyleSheet.absoluteFillObject}
        ref={mapRef}
        mapType="satellite"
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -3.74,
          longitude: -38.5,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        {heatmapData.length > 0 && (
          <Heatmap points={heatmapData} radius={80} opacity={0.8} />
        )}

        {heatmapData.map((point, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            pinColor={
              point.weight > 0.8
                ? "red"
                : point.weight > 0.5
                ? "orange"
                : "yellow"
            }
            onPress={() => navigation.navigate("Details", { id: "" })}
          />
        ))}

        {location && (
          <Marker coordinate={location.coords} zIndex={99}>
            <View style={styles.userMarker} />
          </Marker>
        )}
      </MapView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Criando mapa de abelhas...</Text>
        </View>
      )}

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.showFilterButton}
          onPress={() => setIsOpen((state) => !state)}
        >
          {!isOpen ? (
            <>
              <EyeIcon size={14} color="black" />
              <Text style={styles.showFilterButtonText}>Abrir Filtros</Text>
            </>
          ) : (
            <>
              <EyeClosedIcon size={14} color="black" />
              <Text style={styles.showFilterButtonText}>Fechar Filtros</Text>
            </>
          )}
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.primaryPureRoundedT}>
            <View style={styles.rowCenterPaddingMargin}>
              <View style={styles.rowCenterGap}>
                <View>
                  <Text style={styles.driverNameText}>Definir os filtros</Text>
                  <Text style={styles.plateText}>
                    Você deve selecionar todos os filtros
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.inputsContainer}>
              <View style={styles.centerContent}>
                <TextInput
                  placeholder="Informe o local"
                  style={styles.input}
                  placeholderTextColor="#A9A9A9"
                />
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Selecionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    borderWidth: 3,
    borderColor: "white",
    elevation: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  filtersContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 8,
  },
  showFilterButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 16,
    marginBottom: 8,
    gap: 8,
    elevation: 5,
  },
  showFilterButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryPureRoundedT: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    elevation: 5,
  },
  rowCenterPaddingMargin: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 4,
    paddingBottom: 16,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  rowCenterGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  driverNameText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  plateText: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "gray",
  },
  centerContent: {
    gap: 12,
    alignItems: "center",
  },
  inputsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  selectButton: {
    backgroundColor: "#333",
    borderRadius: 12,
    width: "100%",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  selectButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#CCC",
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "black",
    backgroundColor: "#f0f0f0",
    fontSize: 16,
  },
});
