import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const C = { bg: '#0D0D10', surface: '#17161D', border: '#2D2937', purple: '#A88BFF', pale: '#D0C0FF', text: '#F7F5FA', muted: '#9C98A6' };

const achievements = [
  { icon: 'sparkles', title: 'Primeiro passo', desc: 'Conclua sua primeira missão' },
  { icon: 'flame', title: 'Ritmo constante', desc: 'Pratique por três dias seguidos' },
  { icon: 'graduationcap', title: 'Curioso', desc: 'Explore três áreas diferentes' },
] as const;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>DESENROLA<Text style={styles.brandAccent}>AI</Text></Text>
        <Text style={styles.eyebrow}>SEU PERFIL</Text>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} tintColor={C.pale} size={30} />
          </View>
          <Text style={styles.name}>Sua jornada começa aqui</Text>
          <Text style={styles.handle}>Perfil de visitante</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>XP conquistado</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Missões feitas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Dias ativos</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Conquistas</Text>
        <View style={styles.achievements}>
          {achievements.map((item) => (
            <View key={item.title} style={styles.achievement}>
              <View style={styles.achievementIcon}>
                <SymbolView
                  name={{
                    ios: item.icon === 'sparkles' ? 'sparkles' : item.icon === 'flame' ? 'flame.fill' : 'graduationcap.fill',
                    android: item.icon === 'sparkles' ? 'auto_awesome' : item.icon === 'flame' ? 'local_fire_department' : 'school',
                    web: item.icon === 'sparkles' ? 'auto_awesome' : item.icon === 'flame' ? 'local_fire_department' : 'school',
                  }}
                  tintColor={C.muted}
                  size={19}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.lock}>EM BREVE</Text>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <SymbolView name={{ ios: 'info.circle', android: 'info', web: 'info' }} tintColor={C.purple} size={17} />
          <Text style={styles.noteText}>Seu progresso será salvo na sua conta quando o cadastro estiver disponível.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 22, paddingTop: 18, paddingBottom: 35 },
  brand: { color: C.text, fontSize: 19, fontWeight: '900', letterSpacing: -0.7 },
  brandAccent: { color: C.purple },
  eyebrow: { color: C.purple, fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginTop: 35 },
  profileHeader: { alignItems: 'center', marginTop: 23, marginBottom: 25 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#302642', borderWidth: 1, borderColor: '#51416A', alignItems: 'center', justifyContent: 'center' },
  name: { color: C.text, fontSize: 18, fontWeight: '800', marginTop: 14 },
  handle: { color: C.muted, fontSize: 11, marginTop: 5 },
  stats: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 16, paddingVertical: 17, marginBottom: 29 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: C.pale, fontSize: 22, fontWeight: '800' },
  statLabel: { color: C.muted, fontSize: 9, marginTop: 5 },
  statDivider: { width: 1, height: 32, backgroundColor: C.border },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '800', marginBottom: 13 },
  achievements: { gap: 9 },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 14, padding: 12 },
  achievementIcon: { width: 39, height: 39, backgroundColor: '#24212B', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  achievementTitle: { color: C.text, fontSize: 12, fontWeight: '800' },
  achievementDesc: { color: C.muted, fontSize: 10, marginTop: 4 },
  lock: { color: C.muted, fontSize: 7, fontWeight: '900', letterSpacing: 0.4 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 23, backgroundColor: '#211C2C', borderRadius: 12, padding: 13 },
  noteText: { flex: 1, color: C.muted, fontSize: 10, lineHeight: 15 },
});
