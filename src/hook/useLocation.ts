import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useLocation(siteId: string) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  async function getData() {
    try {
      const response = await api.get<any>(
        `search/v1/measurement/protocol/measureddate/siteid/?protocols=vegatation_covers&startdate=2023-05-05&enddate=2025-05-05&siteid=${siteId}&geojson=TRUE&sample=TRUE`
      );

      setData(response.data.features[0].properties);
    } catch (error) {
      console.log(error.request);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return {
    data,
    loading,
  };
}
