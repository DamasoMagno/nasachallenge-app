import { NavigatorScreenParams } from "@react-navigation/native";

export type AppParamList = {
  Home: undefined;
  Details: {
    id: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppParamList {}
  }
}
