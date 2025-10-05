import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

type LoadingWrapperProps = {
  loading: boolean;
  children: React.ReactNode;
};

export function LoadingWrapper({ loading, children }: LoadingWrapperProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDBB46" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
