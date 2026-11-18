import { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { loadLearningCatalog, type LearningJourney, type LearningMission } from '@/lib/learning';
import { useAuth } from '@/providers/AuthProvider';

const C = { bg: '#0D0D10', surface: '#17161D', border: '#2D2937', purple: '#A88BFF', pale: '#D0C0FF', text: '#F7F5FA', muted: '#9C98A6' };
const journeyIcons = [
  { ios: 'safari', android: 'explore', web: 'explore' },
  { ios: 'wallet.bifold', android: 'account_balance_wallet', web: 'account_balance_wallet' },
  { ios: 'bubble.left.and.bubble.right', android: 'forum', web: 'forum' },
  { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
];

export default function ExploreScreen() {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<LearningJourney[]>([]);
  const [missions, setMissions] = useState<LearningMission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let active = true;
    loadLearningCatalog(user.id)
      .then((catalog) => {
        if (!active) return;
        setJourneys(catalog.journeys);
        setMissions(catalog.missions);
        setCompletedIds(catalog.completedMissionIds);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar as jornadas.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user?.id]);

  const featuredJourney = journeys[0];
  const featuredMissions = featuredJourney ? missions.filter((mission) => mission.journey_id === featuredJourney.id) : [];
  const featuredNext = featuredMissions.find((mission) => !completedIds.includes(mission.id)) ?? featuredMissions[0];

  function openJourney(journey: LearningJourney) {
    const journeyMissions = missions.filter((mission) => mission.journey_id === journey.id);
    const nextMission = journeyMissions.find((mission) => !completedIds.includes(mission.id)) ?? journeyMissions[0];
    if (nextMission) router.push({ pathname: '/mission', params: { id: nextMission.id } } as never);
    else router.navigate('/(tabs)/journeys' as never);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>DESENROLA<Text style={styles.brandAccent}>AI</Text></Text>
        <Text style={styles.eyebrow}>EXPLORE</Text>
        <Text style={styles.title}>Conhecimento que cabe na vida real.</Text>
        <Text style={styles.subtitle}>Escolha uma jornada e descubra habilidades que você pode praticar no dia a dia.</Text>

        {featuredJourney ? (
          <Pressable style={styles.featured} onPress={() => openJourney(featuredJourney)}>
            <View style={styles.featuredIcon}>
              <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor={C.pale} size={21} />
            </View>
            <Text style={styles.featuredTag}>PARA COMEÇAR · {featuredJourney.category.toUpperCase()}</Text>
            <Text style={styles.featuredTitle}>{featuredJourney.title}</Text>
            <Text style={styles.featuredDesc}>{featuredJourney.description}</Text>
            <View style={styles.featuredLink}>
              <Text style={styles.featuredLinkText}>{featuredNext ? 'Começar jornada' : 'Jornada concluída'}</Text>
              <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }} tintColor={C.pale} size={15} />
            </View>
          </Pressable>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{loading ? 'Carregando jornadas...' : 'Novas jornadas em breve'}</Text>
            <Text style={styles.emptyText}>{error || 'Estamos preparando novos conteúdos para você.'}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Todas as jornadas</Text>
        <View style={styles.list}>
          {journeys.map((journey, index) => {
            const related = missions.filter((mission) => mission.journey_id === journey.id);
            const completed = related.filter((mission) => completedIds.includes(mission.id)).length;
            const next = related.find((mission) => !completedIds.includes(mission.id)) ?? related[0];
            const totalXp = related.reduce((sum, mission) => sum + mission.reward_xp, 0);
            return (
              <Pressable key={journey.id} style={styles.topic} onPress={() => openJourney(journey)}>
                <View style={styles.topicIcon}>
                  <SymbolView name={journeyIcons[index % journeyIcons.length]} tintColor={C.purple} size={20} />
                </View>
                <View style={styles.topicBody}>
                  <Text style={styles.topicTag}>{journey.category.toUpperCase()}</Text>
                  <Text style={styles.topicTitle}>{journey.title}</Text>
                  <Text style={styles.topicDesc}>{journey.description}</Text>
                  <Text style={styles.topicMeta}>{related.length} {related.length === 1 ? 'missão' : 'missões'} · {completed} concluídas · até {totalXp} XP</Text>
                </View>
                <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={C.muted} size={15} />
              </Pressable>
            );
          })}
        </View>
        {!loading && !journeys.length && error ? <Text style={styles.error}>{error}</Text> : null}
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
  topicMeta: { color: C.pale, fontSize: 9, fontWeight: '700', marginTop: 7 },
  empty: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 18, marginBottom: 25 },
  emptyTitle: { color: C.text, fontSize: 14, fontWeight: '800' },
  emptyText: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 6 },
  error: { color: '#F0A0A8', fontSize: 10, marginTop: 10 },
});
