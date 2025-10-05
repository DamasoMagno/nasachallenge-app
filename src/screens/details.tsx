import { useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { CaretLeftIcon, MapPinIcon } from "phosphor-react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AppParamList } from "../@types/navigation";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useLocation } from "../hook/useLocation";
import { LoadingWrapper } from "../components/loading"; // 👈 novo import

export function Details() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AppParamList>>();
  const mapRef = useRef<MapView>(null);

  const { data, loading } = useLocation(params.id);
  console.log(data);

  return (
    <LoadingWrapper loading={loading}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <CaretLeftIcon color="black" size={24} />
        </TouchableOpacity>

        <MapView
          ref={mapRef}
          style={{ height: 248, width: "100%" }}
          mapType="satellite"
          zoomControlEnabled
          provider={PROVIDER_GOOGLE}
        />

        <View style={styles.infoPanelContainer}>
          <ScrollView
            style={styles.contentCard}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerInfo}>
              <MapPinIcon size={24} color="#333" />
              <View style={styles.card}>
                <Text style={styles.title}>{data?.siteName}</Text>
                <Text>Organização: {data?.organizationName}</Text>
                <Text>País: {data?.countryName}</Text>
                <Text>Altitude: {data?.elevation}</Text>
                <Text>Medido em: {data?.vegatationcoversMeasuredOn}</Text>
                <Text>Protocolo: {data?.protocol}</Text>
                <Text>Equipes: {data?.vegatationcoversGlobeTeams}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </LoadingWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", position: "relative" },
  backButton: {
    backgroundColor: "white",
    borderRadius: 100,
    justifyContent: "center",
    padding: 8,
    zIndex: 10,
    position: "absolute",
    top: 50,
    left: 16,
    alignItems: "center",
  },
  infoPanelContainer: {
    width: "100%",
    gap: 8,
    marginTop: -24,
    flex: 1,
  },
  contentCard: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cityTitleText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  citySubTitleText: { fontSize: 12, fontWeight: "500", color: "#666" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f4f4f4",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
