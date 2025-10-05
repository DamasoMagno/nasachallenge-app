// hooks/useUserLocation.ts
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export function useUserLocation(timeInterval = 5000, distanceInterval = 10) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval, distanceInterval },
        (loc) => setLocation(loc)
      );
    };

    startLocationUpdates();

    return () => {
      subscription?.remove();
    };
  }, [timeInterval, distanceInterval]);

  return { location, errorMsg };
}
