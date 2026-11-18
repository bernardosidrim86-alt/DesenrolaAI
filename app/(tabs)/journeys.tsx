import { useCallback, useState } from 'react';
import { router, Stack, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { loadLearningCatalog, type LearningJourney, type LearningMission } from '@/lib/learning';
import { useAuth } from '@/providers/AuthProvider';

const C = { bg: '#0D0D10', surface: '#17161D', border: '#2D2937', purple: '#A88BFF', pale: '#D0C0FF', text: '#F7F5FA', muted: '#9C98A6' };

export default function JourneysScreen() {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<LearningJourney[]>([]);
  const [missions, setMissions] = useState<LearningMission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    loadLearningCatalog(user.id)
      .then((catalog) => {
        if (!active) return;
        setJourneys(catalog.journeys);
        setMissions(catalog.missions);
        setCompletedIds(catalog.completedMissionIds);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar suas jornadas.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user?.id]));

  function openJourney(journey: LearningJourney) {
    const related = missions.filter((mission) => mission.journey_id === journey.id);
    const nextMission = related.find((mission) => !completedIds.includes(mission.id)) ?? related[0];
    if (nextMission) router.push({ pathname: '/mission', params: { id: nextMission.id } } as never);
  }

  const completedJourneys = journeys.filter((journey) => {
    const related = missions.filter((mission) => mission.journey_id === journey.id);
    return related.length > 0 && related.every((mission) => completedIds.includes(mission.id));
  }).length;

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
            <Text style={styles.summaryTitle}>{completedJourneys} de {journeys.length} jornadas concluídas</Text>
            <Text style={styles.summaryText}>{loading ? 'Carregando seu progresso...' : 'Seu progresso é atualizado conforme você conclui missões.'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Disponíveis para você</Text>
        {loading && !journeys.length ? <Text style={styles.empty}>Buscando jornadas...</Text> : null}
        {!loading && !journeys.length ? <Text style={styles.empty}>{error || 'Novas jornadas em breve.'}</Text> : null}
        <View style={styles.cards}>
          {journeys.map((journey, index) => {
            const related = missions.filter((mission) => mission.journey_id === journey.id);
            const done = related.filter((mission) => completedIds.includes(mission.id)).length;
            const totalXp = related.reduce((sum, mission) => sum + mission.reward_xp, 0);
            const isComplete = related.length > 0 && done === related.length;
            return (
              <View key={journey.id} style={[styles.card, index === 0 && styles.featured]}>
                <View style={styles.cardTop}>
                  <Text style={styles.tag}>{journey.category.toUpperCase()}</Text>
                  {isComplete ? <Text style={styles.recommended}>CONCLUÍDA</Text> : index === 0 ? <Text style={styles.recommended}>PARA COMEÇAR</Text> : null}
                </View>
                <Text style={styles.cardTitle}>{journey.title}</Text>
                <Text style={styles.cardDesc}>{journey.description}</Text>
                <View style={styles.progressMeta}>
                  <Text style={styles.progressLabel}>{done} de {related.length} missões concluídas</Text>
                  <Text style={styles.progressLabel}>{totalXp} XP disponíveis</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${related.length ? (done / related.length) * 100 : 0}%` }]} />
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <SymbolView name={{ ios: 'list.bullet', android: 'list', web: 'list' }} tintColor={C.muted} size={13} />
                    <Text style={styles.metaText}>{related.length} {related.length === 1 ? 'missão' : 'missões'}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <SymbolView name={{ ios: 'sparkle', android: 'auto_awesome', web: 'auto_awesome' }} tintColor={C.muted} size={13} />
                    <Text style={styles.metaText}>{totalXp} XP</Text>
                  </View>
                </View>
                <Pressable style={styles.button} onPress={() => openJourney(journey)} disabled={!related.length}>
                  <Text style={styles.buttonText}>{isComplete ? 'Rever jornada' : done > 0 ? 'Continuar jornada' : 'Começar jornada'}</Text>
                  <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }} tintColor="#FFFFFF" size={15} />
                </Pressable>
              </View>
            );
          })}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
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
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginTop: 15, marginBottom: 8 },
  progressLabel: { color: C.muted, fontSize: 9 },
  progressTrack: { height: 5, backgroundColor: '#34313B', borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: 5, backgroundColor: C.purple, borderRadius: 8 },
  metaRow: { flexDirection: 'row', gap: 16, marginTop: 13 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: C.muted, fontSize: 10 },
  button: { minHeight: 43, backgroundColor: C.purple, borderRadius: 11, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  buttonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  empty: { color: C.muted, fontSize: 11, marginBottom: 15 },
  error: { color: '#F0A0A8', fontSize: 10, marginTop: 12 },
});
