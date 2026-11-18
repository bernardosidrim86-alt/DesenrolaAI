import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
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

const options = [
  { id: 'a', text: 'Decidir na hora, sem pensar muito.' },
  { id: 'b', text: 'Pesquisar, comparar opções e avaliar o que faz sentido para mim.' },
  { id: 'c', text: 'Escolher o que outra pessoa recomendou, sem conferir.' },
] as const;

export default function MissionScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const { refreshProfile } = useAuth();
  const correct = selected === 'b';

  async function completeMission() {
    if (!correct || completed || saving) return;

    setSaving(true);
    setCompletionMessage('');
    try {
      const { data, error } = await supabase.rpc('complete_mission', {
        p_mission_id: 'autonomia-decisao-01',
      });

      if (error) throw error;

      const result = Array.isArray(data) ? data[0] : data;
      setCompleted(true);
      setCompletionMessage(
        result?.already_completed
          ? 'Você já concluiu esta missão. Seus pontos anteriores estão preservados.'
          : `Missão concluída! Você ganhou ${result?.awarded_xp ?? 100} XP.`,
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
          <Text style={styles.eyebrow}>AUTONOMIA · MISSÃO 01</Text>
          <View style={styles.xpPill}><Text style={styles.xpText}>+100 XP</Text></View>
        </View>
        <Text style={styles.title}>Uma decisão de cada vez.</Text>
        <Text style={styles.subtitle}>
          Aprender a decidir não é ter todas as respostas. É saber avaliar as opções antes de agir.
        </Text>

        <View style={styles.lesson}>
          <Text style={styles.lessonLabel}>NA PRÁTICA</Text>
          <Text style={styles.lessonText}>
            Quando surge uma escolha, uma pausa curta para entender o problema, comparar possibilidades e pensar nas consequências pode evitar decisões por impulso.
          </Text>
        </View>

        <Text style={styles.questionLabel}>SITUAÇÃO DO DIA A DIA</Text>
        <Text style={styles.question}>Você quer comprar algo que custa caro. O que faz primeiro?</Text>

        <View style={styles.options}>
          {options.map((option) => {
            const active = selected === option.id;
            return (
              <Pressable
                key={option.id}
                disabled={completed}
                onPress={() => {
                  setSelected(option.id);
                  setSubmitted(false);
                  setCompletionMessage('');
                }}
                style={[
                  styles.option,
                  active && styles.optionActive,
                  submitted && option.id === 'b' && styles.optionCorrect,
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
              <Text style={styles.feedbackText}>
                Comparar opções, conferir se a compra cabe no orçamento e pensar se você realmente precisa do item ajuda a decidir com mais consciência.
              </Text>
            </View>
          </View>
        ) : null}

        <Pressable
          disabled={!selected || completed}
          onPress={() => setSubmitted(true)}
          style={[styles.submit, (!selected || completed) && styles.submitDisabled]}
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
              <Text style={styles.submitText}>Concluir missão e ganhar 100 XP</Text>
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
