import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const C = { bg: '#0D0D10', surface: '#17161D', border: '#2D2937', purple: '#A88BFF', pale: '#D0C0FF', text: '#F7F5FA', muted: '#9C98A6' };

const topics = [
  { n: '01', title: 'Dinheiro e consumo', desc: 'Organize seu dinheiro e faça escolhas melhores.', icon: { ios: 'wallet.bifold', android: 'account_balance_wallet', web: 'account_balance_wallet' }, tag: 'FINANÇAS' },
  { n: '02', title: 'Comunicação e relações', desc: 'Converse, negocie e expresse suas ideias com clareza.', icon: { ios: 'bubble.left.and.bubble.right', android: 'forum', web: 'forum' }, tag: 'RELAÇÕES' },
  { n: '03', title: 'Organização e autonomia', desc: 'Planeje seu tempo e resolva situações do cotidiano.', icon: { ios: 'checkmark.circle', android: 'task_alt', web: 'task_alt' }, tag: 'VIDA PRÁTICA' },
  { n: '04', title: 'Mundo digital', desc: 'Proteja seus dados, reconheça golpes e use tecnologia.', icon: { ios: 'lock.shield', android: 'security', web: 'security' }, tag: 'TECNOLOGIA' },
  { n: '05', title: 'Trabalho e carreira', desc: 'Prepare-se para oportunidades e novos desafios.', icon: { ios: 'briefcase', android: 'work', web: 'work' }, tag: 'CARREIRA' },
  { n: '06', title: 'Desenvolvimento pessoal', desc: 'Conheça seus objetivos e fortaleça seus hábitos.', icon: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }, tag: 'AUTOCONHECIMENTO' },
] as const;

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>DESENROLA<Text style={styles.brandAccent}>AI</Text></Text>
        <Text style={styles.eyebrow}>EXPLORE</Text>
        <Text style={styles.title}>Conhecimento que cabe na vida real.</Text>
        <Text style={styles.subtitle}>Escolha uma área e descubra habilidades que você pode praticar no dia a dia.</Text>

        <Pressable style={styles.featured} onPress={() => router.push('/(tabs)/journeys' as never)}>
          <View style={styles.featuredIcon}>
            <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor={C.pale} size={21} />
          </View>
          <Text style={styles.featuredTag}>PARA COMEÇAR</Text>
          <Text style={styles.featuredTitle}>Vida real 101</Text>
          <Text style={styles.featuredDesc}>Uma introdução prática para tomar decisões, organizar prioridades e se virar melhor.</Text>
          <View style={styles.featuredLink}>
            <Text style={styles.featuredLinkText}>Ver jornada</Text>
            <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }} tintColor={C.pale} size={15} />
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Todas as áreas</Text>
        <View style={styles.list}>
          {topics.map((topic) => (
            <Pressable key={topic.n} style={styles.topic} onPress={() => router.push('/(tabs)/journeys' as never)}>
              <View style={styles.topicIcon}>
                <SymbolView name={topic.icon} tintColor={C.purple} size={20} />
              </View>
              <View style={styles.topicBody}>
                <Text style={styles.topicTag}>{topic.tag}</Text>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDesc}>{topic.desc}</Text>
              </View>
              <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={C.muted} size={15} />
            </Pressable>
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
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 10, marginBottom: 22 },
  featured: { backgroundColor: '#211C2C', borderRadius: 18, borderWidth: 1, borderColor: '#45385B', padding: 18, marginBottom: 27 },
  featuredIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#392E4E', alignItems: 'center', justifyContent: 'center', marginBottom: 17 },
  featuredTag: { color: C.purple, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  featuredTitle: { color: C.text, fontSize: 22, fontWeight: '800', marginTop: 7 },
  featuredDesc: { color: '#B4AFBE', fontSize: 12, lineHeight: 19, marginTop: 7 },
  featuredLink: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 17 },
  featuredLinkText: { color: C.pale, fontSize: 12, fontWeight: '800' },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '800', marginBottom: 12 },
  list: { gap: 9 },
  topic: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 15, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  topicIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#282235', alignItems: 'center', justifyContent: 'center' },
  topicBody: { flex: 1 },
  topicTag: { color: C.purple, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  topicTitle: { color: C.text, fontSize: 13, fontWeight: '800', marginTop: 3 },
  topicDesc: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
});
