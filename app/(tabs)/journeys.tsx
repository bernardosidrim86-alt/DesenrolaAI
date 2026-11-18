import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const C = { bg: '#0D0D10', surface: '#17161D', border: '#2D2937', purple: '#A88BFF', pale: '#D0C0FF', text: '#F7F5FA', muted: '#9C98A6' };

const items = [
  { tag: 'COMECE AQUI', title: 'Vida real 101', desc: 'Sete pequenas missões para desenvolver habilidades úteis no cotidiano.', duration: '7 dias', lessons: '7 missões', featured: true },
  { tag: 'DINHEIRO E CONSUMO', title: 'Seu dinheiro, suas escolhas', desc: 'Entenda seu orçamento, compare opções e planeje melhor.', duration: '5 dias', lessons: '5 missões', featured: false },
  { tag: 'COMUNICAÇÃO', title: 'Converse com confiança', desc: 'Pratique escuta, clareza e limites em situações comuns.', duration: '5 dias', lessons: '5 missões', featured: false },
];

export default function JourneysScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>DESENROLA<Text style={styles.brandAccent}>AI</Text></Text>
        <Text style={styles.eyebrow}>SUAS JORNADAS</Text>
        <Text style={styles.title}>Evolução acontece passo a passo.</Text>
        <Text style={styles.subtitle}>Jornadas curtas, com situações práticas para aprender fazendo.</Text>

        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <SymbolView name={{ ios: 'map.fill', android: 'map', web: 'map' }} tintColor={C.pale} size={19} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>Seu caminho começa agora</Text>
            <Text style={styles.summaryText}>Você ainda não iniciou nenhuma jornada.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Disponíveis para você</Text>
        <View style={styles.cards}>
          {items.map((item, index) => (
            <View key={item.title} style={[styles.card, item.featured && styles.featured]}>
              <View style={styles.cardTop}>
                <Text style={styles.tag}>{item.tag}</Text>
                {item.featured ? <Text style={styles.recommended}>RECOMENDADA</Text> : null}
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <SymbolView name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }} tintColor={C.muted} size={13} />
                  <Text style={styles.metaText}>{item.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <SymbolView name={{ ios: 'flag', android: 'flag', web: 'flag' }} tintColor={C.muted} size={13} />
                  <Text style={styles.metaText}>{item.lessons}</Text>
                </View>
              </View>
              <Pressable style={styles.button} onPress={() => router.push('/mission' as never)}>
                <Text style={styles.buttonText}>{index === 0 ? 'Começar jornada' : 'Conhecer jornada'}</Text>
                <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }} tintColor="#FFFFFF" size={15} />
              </Pressable>
            </View>
          ))}
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
  title: { color: C.text, fontSize: 29, lineHeight: 35, fontWeight: '800', letterSpacing: -0.9, marginTop: 9 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 10, marginBottom: 21 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 15, padding: 14, marginBottom: 27 },
  summaryIcon: { width: 40, height: 40, backgroundColor: '#302642', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { color: C.text, fontSize: 12, fontWeight: '800' },
  summaryText: { color: C.muted, fontSize: 10, marginTop: 4 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '800', marginBottom: 13 },
  cards: { gap: 12 },
  card: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 17, padding: 17 },
  featured: { backgroundColor: '#211C2C', borderColor: '#45385B' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { color: C.purple, fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  recommended: { color: C.pale, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  cardTitle: { color: C.text, fontSize: 18, fontWeight: '800', marginTop: 12 },
  cardDesc: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 6 },
  metaRow: { flexDirection: 'row', gap: 16, marginTop: 15 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: C.muted, fontSize: 10 },
  button: { minHeight: 43, backgroundColor: C.purple, borderRadius: 11, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  buttonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});
