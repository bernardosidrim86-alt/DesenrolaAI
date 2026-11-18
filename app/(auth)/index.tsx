import { useState } from 'react';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

const C = {
  bg: '#0D0D10',
  surface: '#17161D',
  border: '#302C39',
  purple: '#A88BFF',
  pale: '#D0C0FF',
  text: '#F7F5FA',
  muted: '#9C98A6',
  danger: '#F0A0A8',
  green: '#8BD8B0',
};

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  const { signIn, signUp } = useAuth();

  async function handleSubmit() {
    setErrorMessage('');
    setNotice('');

    if (!isSupabaseConfigured) {
      setErrorMessage('O aplicativo ainda não está conectado ao Supabase. Configure o arquivo .env.local.');
      return;
    }

    if (mode === 'signup' && displayName.trim().length < 2) {
      setErrorMessage('Digite seu nome para continuar.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Digite um e-mail válido.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Sua senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        const result = await signUp(displayName, email, password);
        if (result.needsEmailConfirmation) {
          setNotice('Conta criada! Confira seu e-mail e confirme o cadastro. Depois, volte aqui para entrar.');
        } else {
          setNotice('Conta criada com sucesso. Estamos preparando seu perfil.');
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível concluir. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <SymbolView
                name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                tintColor={C.pale}
                size={22}
              />
            </View>
            <Text style={styles.brand}>DESENROLA<Text style={styles.brandAccent}>AI</Text></Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.eyebrow}>A VIDA NÃO VEM COM MANUAL</Text>
            <Text style={styles.title}>
              Aprenda a
              {'\n'}
              <Text style={styles.titleAccent}>desenrolar.</Text>
            </Text>
            <Text style={styles.subtitle}>
              Habilidades para a vida real. Aprenda no seu ritmo, pratique no seu dia.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.modeSwitch}>
              <Pressable
                onPress={() => { setMode('signup'); setErrorMessage(''); setNotice(''); }}
                style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}
              >
                <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Criar conta</Text>
              </Pressable>
              <Pressable
                onPress={() => { setMode('login'); setErrorMessage(''); setNotice(''); }}
                style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
              >
                <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>Entrar</Text>
              </Pressable>
            </View>

            <Text style={styles.formTitle}>
              {mode === 'signup' ? 'Comece sua jornada' : 'Que bom ter você de volta'}
            </Text>
            <Text style={styles.formSubtitle}>
              {mode === 'signup' ? 'Crie sua conta gratuitamente.' : 'Entre para continuar de onde parou.'}
            </Text>

            {mode === 'signup' ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>SEU NOME</Text>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Como podemos te chamar?"
                  placeholderTextColor="#777381"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  style={styles.input}
                />
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="voce@email.com"
                placeholderTextColor="#777381"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>SENHA</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo de 8 caracteres"
                placeholderTextColor="#777381"
                secureTextEntry
                autoCapitalize="none"
                textContentType={mode === 'signup' ? 'newPassword' : 'password'}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                style={styles.input}
              />
            </View>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            {notice ? <Text style={styles.notice}>{notice}</Text> : null}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [styles.submit, pressed && styles.pressed, loading && styles.disabled]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>
                  {mode === 'signup' ? 'Criar minha conta' : 'Entrar na minha conta'}
                </Text>
              )}
            </Pressable>

            <Text style={styles.terms}>
              Ao continuar, você concorda em usar a plataforma de acordo com nossos termos e política de privacidade.
            </Text>
          </View>

          <Text style={styles.footer}>APRENDA. PRATIQUE. DESENROLE.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 25, justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 39, height: 39, borderRadius: 12, backgroundColor: '#302642', borderWidth: 1, borderColor: '#51416A', alignItems: 'center', justifyContent: 'center' },
  brand: { color: C.text, fontSize: 21, fontWeight: '900', letterSpacing: -0.8 },
  brandAccent: { color: C.purple },
  hero: { marginTop: 42, marginBottom: 27 },
  eyebrow: { color: C.purple, fontSize: 9, fontWeight: '900', letterSpacing: 1.6, marginBottom: 11 },
  title: { color: C.text, fontSize: 39, lineHeight: 44, fontWeight: '900', letterSpacing: -1.5 },
  titleAccent: { color: C.pale },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 12, maxWidth: 310 },
  formCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 17 },
  modeSwitch: { flexDirection: 'row', backgroundColor: '#0F0E13', borderRadius: 11, padding: 4, marginBottom: 22 },
  modeButton: { flex: 1, minHeight: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  modeButtonActive: { backgroundColor: '#302642' },
  modeText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  modeTextActive: { color: C.pale },
  formTitle: { color: C.text, fontSize: 19, fontWeight: '800' },
  formSubtitle: { color: C.muted, fontSize: 11, marginTop: 5, marginBottom: 17 },
  fieldGroup: { marginBottom: 14 },
  label: { color: '#B7B2C0', fontSize: 9, fontWeight: '800', letterSpacing: 1.1, marginBottom: 7 },
  input: { height: 48, borderRadius: 11, borderWidth: 1, borderColor: C.border, backgroundColor: '#111015', color: C.text, paddingHorizontal: 13, fontSize: 13 },
  error: { color: C.danger, fontSize: 11, lineHeight: 16, marginBottom: 12 },
  notice: { color: C.green, fontSize: 11, lineHeight: 16, marginBottom: 12 },
  submit: { minHeight: 49, borderRadius: 12, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  submitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.55 },
  terms: { color: '#777381', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 14 },
  footer: { color: '#777381', fontSize: 8, fontWeight: '800', letterSpacing: 1.8, textAlign: 'center', marginTop: 24 },
});
