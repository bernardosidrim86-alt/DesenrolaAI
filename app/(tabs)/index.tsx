import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const C = {
  background: '#0D0D10',
  surface: '#17161D',
  surfaceRaised: '#211C2C',
  border: '#2D2937',
  purple: '#A88BFF',
  purpleSoft: '#D0C0FF',
  text: '#F7F5FA',
  muted: '#9C98A6',
  green: '#8BD8B0',
};

const categories = [
  { number: '01', title: 'Dinheiro', description: 'Faça escolhas melhores', icon: { ios: 'wallet.bifold', android: 'account_balance_wallet', web: 'account_balance_wallet' } },
  { number: '02', title: 'Comunicação', description: 'Expresse suas ideias', icon: { ios: 'bubble.left.and.bubble.right', android: 'forum', web: 'forum' } },
  { number: '03', title: 'Autonomia', description: 'Resolva as coisas por conta própria', icon: { ios: 'safari', android: 'explore', web: 'explore' } },
  { number: '04', title: 'Mundo digital', description: 'Use a tecnologia com segurança', icon: { ios: 'iphone', android: 'smartphone', web: 'smartphone' } },
] as const;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={C.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              DESENROLA<Text style={styles.brandAccent}>AI</Text>
            </Text>
            <Text style={styles.brandCaption}>APRENDA. PRATIQUE. DESENROLE.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
            onPress={() => router.navigate('/(tabs)/profile' as never)}
            style={styles.avatar}
          >
            <SymbolView
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              tintColor={C.purpleSoft}
              size={19}
            />
          </Pressable>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>BOM TER VOCÊ POR AQUI</Text>
          <Text style={styles.headline}>
            A vida acontece.
            {'\n'}
            <Text style={styles.headlineAccent}>Aprenda a desenrolar.</Text>
          </Text>
          <Text style={styles.description}>
            Habilidades para situações reais, em pequenas etapas que cabem no seu dia.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.overline}>SUA EVOLUÇÃO</Text>
              <Text style={styles.level}>Nível 1 <Text style={styles.levelCaption}>· Começando</Text></Text>
            </View>
            <View style={styles.xpPill}>
              <SymbolView
                name={{ ios: 'sparkle', android: 'auto_awesome', web: 'auto_awesome' }}
                tintColor={C.purpleSoft}
                size={13}
              />
              <Text style={styles.xpText}>0 XP</Text>
            </View>
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.metaText}>Sua primeira conquista está perto</Text>
            <Text style={styles.metaText}>0%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.cardHint}>Conclua missões para avançar de nível.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Comece por aqui</Text>
            <Text style={styles.sectionSubtitle}>Uma missão rápida para hoje</Text>
          </View>
          <View style={styles.durationPill}>
            <SymbolView
              name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
              tintColor={C.muted}
              size={12}
            />
            <Text style={styles.durationText}>3 min</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/mission' as never)}
          style={({ pressed }) => [styles.missionCard, pressed && styles.pressed]}
        >
          <View style={styles.missionTop}>
            <View style={styles.missionIcon}>
              <SymbolView
                name={{ ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' }}
                tintColor={C.purpleSoft}
                size={21}
              />
            </View>
            <Text style={styles.reward}>+100 XP</Text>
          </View>
          <Text style={styles.missionLabel}>AUTONOMIA · PRIMEIROS PASSOS</Text>
          <Text style={styles.missionTitle}>Uma decisão de cada vez.</Text>
          <Text style={styles.missionDescription}>
            Treine como pensar antes de decidir diante de uma situação comum do dia a dia.
          </Text>
          <View style={styles.missionAction}>
            <Text style={styles.missionActionText}>Começar missão</Text>
            <SymbolView
              name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
              tintColor="#FFFFFF"
              size={17}
            />
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>O que você quer aprender?</Text>
            <Text style={styles.sectionSubtitle}>Explore habilidades para a vida real</Text>
          </View>
          <Pressable onPress={() => router.navigate('/(tabs)/explore' as never)}>
            <Text style={styles.seeAll}>VER TUDO</Text>
          </Pressable>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <Pressable
              key={category.number}
              onPress={() => router.navigate('/(tabs)/explore' as never)}
              style={({ pressed }) => [styles.categoryCard, pressed && styles.pressed]}
            >
              <View style={styles.categoryTop}>
                <Text style={styles.categoryNumber}>{category.number}</Text>
                <SymbolView name={category.icon} tintColor={C.purple} size={19} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>DESENROLA<Text style={styles.brandAccent}>AI</Text></Text>
          <Text style={styles.footerText}>A vida não vem com manual.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 34 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 38 },
  brand: { color: C.text, fontSize: 22, fontWeight: '900', letterSpacing: -0.9 },
  brandAccent: { color: C.purple },
  brandCaption: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1.7, marginTop: 5 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#211C2C', borderWidth: 1, borderColor: '#473A62', alignItems: 'center', justifyContent: 'center' },
  intro: { marginBottom: 25 },
  eyebrow: { color: C.purple, fontSize: 9, fontWeight: '800', letterSpacing: 1.8, marginBottom: 11 },
  headline: { color: C.text, fontSize: 31, lineHeight: 38, fontWeight: '800', letterSpacing: -1.1 },
  headlineAccent: { color: C.purpleSoft },
  description: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 12, maxWidth: 330 },
  progressCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 18, marginBottom: 31 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overline: { color: C.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  level: { color: C.text, fontSize: 21, fontWeight: '800', marginTop: 5 },
  levelCaption: { color: C.muted, fontSize: 12, fontWeight: '500' },
  xpPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 20, backgroundColor: '#302642' },
  xpText: { color: C.purpleSoft, fontSize: 11, fontWeight: '800' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, marginBottom: 9 },
  metaText: { color: C.muted, fontSize: 10 },
  progressTrack: { height: 6, backgroundColor: '#34313B', borderRadius: 8, overflow: 'hidden' },
  progressFill: { width: '0%', height: 6, backgroundColor: C.purple, borderRadius: 8 },
  cardHint: { color: C.muted, fontSize: 10, marginTop: 11 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  sectionSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  durationPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6 },
  durationText: { color: C.muted, fontSize: 10, fontWeight: '600' },
  missionCard: { backgroundColor: C.surfaceRaised, borderWidth: 1, borderColor: '#413653', borderRadius: 19, padding: 18, marginBottom: 31 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  missionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  missionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#382D4B', alignItems: 'center', justifyContent: 'center' },
  reward: { color: C.purpleSoft, fontSize: 11, fontWeight: '800' },
  missionLabel: { color: C.purple, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  missionTitle: { color: C.text, fontSize: 22, lineHeight: 28, fontWeight: '800', marginTop: 8 },
  missionDescription: { color: '#B0ABB9', fontSize: 12, lineHeight: 19, marginTop: 8 },
  missionAction: { backgroundColor: C.purple, borderRadius: 11, minHeight: 46, paddingHorizontal: 15, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  missionActionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  seeAll: { color: C.purple, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  categoryCard: { width: '48%', minHeight: 122, borderRadius: 15, padding: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  categoryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  categoryNumber: { color: C.purple, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  categoryTitle: { color: C.text, fontSize: 13, fontWeight: '800' },
  categoryDescription: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 5 },
  footer: { alignItems: 'center', marginTop: 35, paddingTop: 20, borderTopWidth: 1, borderTopColor: C.border },
  footerBrand: { color: C.text, fontSize: 13, fontWeight: '900', letterSpacing: 1.1 },
  footerText: { color: C.muted, fontSize: 10, marginTop: 5 },
});