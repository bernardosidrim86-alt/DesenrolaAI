import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

const COLORS = {
  background: '#0D0D10',
  surface: '#141319',
  border: '#282530',
  active: '#A88BFF',
  inactive: '#797683',
};

const TAB_ICONS = {
  index: {
    ios: 'house.fill',
    android: 'home',
    web: 'home',
  },
  explore: {
    ios: 'safari',
    android: 'explore',
    web: 'explore',
  },
  journeys: {
    ios: 'map.fill',
    android: 'map',
    web: 'map',
  },
  profile: {
    ios: 'person.crop.circle.fill',
    android: 'account-circle',
    web: 'account-circle',
  },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 82,
          paddingTop: 9,
          paddingBottom: 17,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 3,
        },
        tabBarIconStyle: {
          marginBottom: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <SymbolView name={TAB_ICONS.index} tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => (
            <SymbolView name={TAB_ICONS.explore} tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="journeys"
        options={{
          title: 'Jornadas',
          tabBarIcon: ({ color }) => (
            <SymbolView name={TAB_ICONS.journeys} tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <SymbolView name={TAB_ICONS.profile} tintColor={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
