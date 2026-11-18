import { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { type LearningMission, type MissionOption } from '@/lib/learning';
import { useAuth } from '@/providers/AuthProvider';

const C = {
  bg: '#0D0D10',
  surface: '#17161D',
  border: '#2D2937',
  purple: '#A88BFF',
  pale: '#D0C0FF',
  text: '#F7F5FA',
  muted: '#9C98A6',
  green: '#8BD8B0',
  danger: '#F0A0A8',
};

export default function MissionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const missionId = typeof id === 'string' && id ? id : 'autonomia-decisao-01';
  const { user, refreshProfile } = useAuth();
  const [mission, setMission] = useState<LearningMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setMission(null);
    setLoadError('');
    setSelected(null);
    setSubmitted(false);
    setCompleted(false);
    setCompletionMessage('');

    async function loadMission() {
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('id, journey_id, category, title, description, reward_xp, lesson_content, question, options, correct_option, explanation, estimated_minutes, sort_order')
          .eq('id', missionId)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Esta missão não está disponível no momento.');

        const { data: completion, error: completionError } = await supabase
          .from('mission_completions')
          .select('mission_id')
          .eq('user_id', user.id)
          .eq('mission_id', missionId)
          .maybeSingle();

        if (completionError) throw completionError;
        if (!active) return;

        setMission(data as LearningMission);
        if (completion) {
          setCompleted(true);
          setCompletionMessage('Você já concluiu esta missão. Seu progresso está salvo.');
        }
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar esta missão.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMission();
    return () => { active = false; };
  }, [missionId, user?.id]);

  const options = (mission?.options ?? []) as MissionOption[];
  const correct = Boolean(mission && selected === mission.correct_option);

  async function completeMission() {
    if (!mission || !correct || completed || saving) return;

    setSaving(true);
    setCompletionMessage('');
    try {
      const { data, error } = await supabase.rpc('complete_mission', {
        p_mission_id: mission.id,
        p_selected_option: selected ?? '',
      });

      if (error) throw error;

      const result = (Array.isArray(data) ? data[0] : data) as {
        awarded_xp?: number;
        already_completed?: boolean;
      } | null;
      setCompleted(true);
      setCompletionMessage(
        result?.already_completed
          ? 'Você já concluiu esta missão. Seus pontos anteriores estão preservados.'
          : `Missão concluída! Você ganhou ${result?.awarded_xp ?? mission.reward_xp} XP.`,
      );
      await refreshProfile();
    } catch (error) {
      setCompletionMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar sua conclusão. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <View style={styles.center}>
          <ActivityIndicator color={C.purple} size="large" />
          <Text style={styles.loadText}>Carregando missão...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!mission) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Não encontramos essa missão.</Text>
          <Text style={styles.loadText}>{loadError || 'Tente voltar e escolher outra jornada.'}</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} tintColor={C.text} size={17} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        <View style={styles.metaRow}>
          <Text style={styles.eyebrow}>{mission.category.toUpperCase()}</Text>
          <View style={styles.xpPill}><Text style={styles.xpText}>+{mission.reward_xp} XP</Text></View>
        </View>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.subtitle}>{mission.description}</Text>

        <View style={styles.lesson}>
          <Text style={styles.lessonLabel}>NA PRÁTICA</Text>
          <Text style={styles.lessonText}>{mission.lesson_content}</Text>
        </View>

        <Text style={styles.questionLabel}>SITUAÇÃO DO DIA A DIA</Text>
        <Text style={styles.question}>{mission.question}</Text>

        <View style={styles.options}>
          {options.map((option) => {
            const active = selected === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => {
                  setSelected(option.id);
                  setSubmitted(false);
                  if (!completed) setCompletionMessage('');
                }}
                style={[
                  styles.option,
                  active && styles.optionActive,
                  submitted && correct && active && styles.optionCorrect,
                ]}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active ? <View style={styles.radioInner} /> : null}
                </View>
                <Text style={styles.optionText}>{option.text}</Text>
              </Pressable>
            );
          })}
        </View>

        {submitted ? (
          <View style={styles.feedback}>
            <SymbolView
              name={{ ios: correct ? 'checkmark.circle.fill' : 'lightbulb.fill', android: correct ? 'check_circle' : 'lightbulb', web: correct ? 'check_circle' : 'lightbulb' }}
              tintColor={correct ? C.green : C.pale}
              size={21}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.feedbackTitle}>{correct ? 'Boa escolha.' : 'Vamos pensar de novo.'}</Text>
              <Text style={styles.feedbackText}>{mission.explanation}</Text>
            </View>
          </View>
        ) : null}

        <Pressable
          disabled={!selected}
          onPress={() => setSubmitted(true)}
          style={[styles.submit, !selected && styles.submitDisabled]}
        >
          <Text style={styles.submitText}>
            {submitted ? 'Resposta conferida' : 'Conferir resposta'}
          </Text>
        </Pressable>

        {submitted && correct && !completed ? (
          <Pressable
            onPress={completeMission}
            disabled={saving}
            style={[styles.completeButton, saving && styles.submitDisabled]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Concluir missão e ganhar {mission.reward_xp} XP</Text>
            )}
          </Pressable>
        ) : null}

        {completionMessage ? (
          <Text style={[styles.completionMessage, completed && styles.successMessage]}>
            {completionMessage}
          </Text>
        ) : null}

        <Text style={styles.disclaimer}>
          Seu progresso fica vinculado à sua conta. Cada missão só concede XP uma vez.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  loadText: { color: C.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 12 },
  errorTitle: { color: C.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  backButton: { minHeight: 44, paddingHorizontal: 25, backgroundColor: C.purple, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  backButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  content: { padding: 22, paddingTop: 16, paddingBottom: 40 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, alignSelf: 'flex-start' },
  backText: { color: C.muted, fontSize: 12, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28 },
  eyebrow: { color: C.purple, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  xpPill: { backgroundColor: '#302642', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  xpText: { color: C.pale, fontSize: 10, fontWeight: '800' },
  title: { color: C.text, fontSize: 29, lineHeight: 35, fontWeight: '800', letterSpacing: -0.8, marginTop: 13 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 9, marginBottom: 22 },
  lesson: { backgroundColor: '#211C2C', borderColor: '#45385B', borderWidth: 1, borderRadius: 15, padding: 16, marginBottom: 26 },
  lessonLabel: { color: C.purple, fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  lessonText: { color: '#D0CBD8', fontSize: 12, lineHeight: 19, marginTop: 8 },
  questionLabel: { color: C.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  question: { color: C.text, fontSize: 19, lineHeight: 26, fontWeight: '800', marginTop: 8, marginBottom: 15 },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 13, padding: 14 },
  optionActive: { borderColor: C.purple, backgroundColor: '#211C2C' },
  optionCorrect: { borderColor: C.green },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: '#797583', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: C.purple },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: C.purple },
  optionText: { flex: 1, color: C.text, fontSize: 12, lineHeight: 18 },
  feedback: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, backgroundColor: '#1B2724', borderColor: '#315044', borderWidth: 1, borderRadius: 13, marginTop: 15 },
  feedbackTitle: { color: C.text, fontSize: 12, fontWeight: '800' },
  feedbackText: { color: '#B7C7BF', fontSize: 11, lineHeight: 17, marginTop: 5 },
  submit: { backgroundColor: C.purple, borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  completeButton: { backgroundColor: '#5A3E92', borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  submitDisabled: { opacity: 0.4 },
  submitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  completionMessage: { color: C.pale, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 15 },
  successMessage: { color: C.green },
  disclaimer: { color: C.muted, fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 15 },
});
