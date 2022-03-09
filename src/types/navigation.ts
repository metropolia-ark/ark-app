import { CompositeNavigationProp as Composite, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp as Stack } from '@react-navigation/native-stack';
import { BottomTabNavigationProp as BottomTab } from '@react-navigation/bottom-tabs';

// Parameter list for each navigator
export namespace ParamList {
  export type Unauthenticated = {
    SignIn: undefined;
    SignUp: undefined;
  };
  export type Authenticated = {
    Tabs: undefined;
    Media: { mediaId: number };
    User: { userId: number };
  };
  export type Tabs = {
    Posts: undefined;
    Market: undefined;
    New: undefined;
    Profile: undefined;
    Settings: undefined;
  };
}

// Navigation props for each screen that can be passed to the `useNavigation()` hook
export namespace Navigation {
  export type SignIn = Stack<ParamList.Unauthenticated, 'SignIn'>;
  export type SignUp = Stack<ParamList.Unauthenticated, 'SignUp'>;
  export type Media = Stack<ParamList.Authenticated, 'Media'>;
  export type User = Stack<ParamList.Authenticated, 'User'>;
  export type Posts = Composite<BottomTab<ParamList.Tabs, 'Posts'>, Stack<ParamList.Authenticated, 'Tabs'>>;
  export type Market = Composite<BottomTab<ParamList.Tabs, 'Market'>, Stack<ParamList.Authenticated, 'Tabs'>>;
  export type New = Composite<BottomTab<ParamList.Tabs, 'New'>, Stack<ParamList.Authenticated, 'Tabs'>>;
  export type Profile = Composite<BottomTab<ParamList.Tabs, 'Profile'>, Stack<ParamList.Authenticated, 'Tabs'>>;
  export type Settings = Composite<BottomTab<ParamList.Tabs, 'Settings'>, Stack<ParamList.Authenticated, 'Tabs'>>;
}

// Route props for each screen that can be passed to the `useRoute()` hook
export namespace Route {
  export type SignIn = RouteProp<ParamList.Unauthenticated, 'SignIn'>;
  export type SignUp = RouteProp<ParamList.Unauthenticated, 'SignIn'>;
  export type Media = RouteProp<ParamList.Authenticated, 'Media'>;
  export type User = RouteProp<ParamList.Authenticated, 'User'>;
  export type Posts = RouteProp<ParamList.Tabs, 'Posts'>;
  export type Market = RouteProp<ParamList.Tabs, 'Market'>;
  export type New = RouteProp<ParamList.Tabs, 'New'>;
  export type Profile = RouteProp<ParamList.Tabs, 'Profile'>;
  export type Settings = RouteProp<ParamList.Tabs, 'Settings'>;
}
