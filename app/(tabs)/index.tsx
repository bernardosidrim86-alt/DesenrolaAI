
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const purple = "#9878F5";

const categories = [
  { number: "01", name: "Dinheiro", desc: "Faça escolhas melhores" },
  { number: "02", name: "Comunicação", desc: "Expresse suas ideias" },
  { number: "03", name: "Autonomia", desc: "Assuma o controle" },
  { number: "04", name: "Mundo digital", desc: "Domine o digital" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              TRILHA<Text style={{ color: purple }}>.</Text>
            </Text>
            <Text style={styles.tagline}>SUA EVOLUÇÃO COMEÇA AQUI</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>BEM-VINDO À TRILHA</Text>
          <Text style={styles.title}>
            Cada dia é uma{"\n"}
            <Text style={{ color: purple }}>nova oportunidade.</Text>
          </Text>
          <Text style={styles.description}>
            Desenvolva habilidades, descubra possibilidades
            e evolua no seu próprio ritmo.
          </Text>
        </View>

        <View style={styles.xpCard}>
          <View style={styles.row}>
            <View>
              <Text style={styles.mutedLabel}>SUA EVOLUÇÃO</Text>
              <Text style={styles.level}>Nível 01</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>✦ 0 XP</Text>
            </View>
          </View>

          <View style={[styles.row, { marginTop: 25, marginBottom: 10 }]}>
            <Text style={styles.muted}>Seu primeiro passo</Text>
            <Text style={styles.muted}>0%</Text>
          </View>

          <View style={styles.progress}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.xpFooter}>
            Complete missões para desbloquear novos níveis.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sua missão de hoje</Text>
          <Text style={styles.sectionAccent}>01 / 01</Text>
        </View>

        <View style={styles.mission}>
          <View style={styles.row}>
            <View style={styles.missionIcon}>
              <Text style={styles.missionIconText}>✦</Text>
            </View>
            <Text style={styles.reward}>+100 XP</Text>
          </View>

          <Text style={styles.categoryLabel}>
            DESENVOLVIMENTO PESSOAL
          </Text>

          <Text style={styles.missionTitle}>Comece por você.</Text>

          <Text style={styles.missionDescription}>
            Descubra como pequenas decisões podem transformar
            sua maneira de viver.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() =>
              Alert.alert(
                "Sua primeira missão",
                "Estamos preparando sua jornada. Em breve você poderá começar!"
              )
            }
          >
            <Text style={styles.buttonText}>Começar missão</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore possibilidades</Text>
          <Text style={styles.sectionAccent}>CATEGORIAS</Text>
        </View>

        <View style={styles.grid}>
          {categories.map((item) => (
            <View key={item.number} style={styles.categoryCard}>
              <Text style={styles.number}>{item.number}</Text>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>TRILHA.</Text>
          <Text style={styles.footerText}>
            Evolua um pouco todos os dias.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0D0D10",
  },
  container: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  tagline: {
    color: "#898793",
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: "700",
    marginTop: 4,
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#292333",
    borderWidth: 1,
    borderColor: "#57447F",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  intro: {
    marginBottom: 28,
  },
  eyebrow: {
    color: purple,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 33,
    lineHeight: 41,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  description: {
    color: "#9997A3",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 13,
  },
  xpCard: {
    backgroundColor: "#19181F",
    borderWidth: 1,
    borderColor: "#2B2933",
    borderRadius: 19,
    padding: 19,
    marginBottom: 34,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mutedLabel: {
    color: "#93919E",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  level: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 7,
  },
  xpBadge: {
    backgroundColor: "#302744",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },
  xpText: {
    color: "#C6B3FF",
    fontSize: 12,
    fontWeight: "800",
  },
  muted: {
    color: "#92909C",
    fontSize: 11,
  },
  progress: {
    height: 6,
    backgroundColor: "#34313D",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    width: "0%",
    height: 6,
    backgroundColor: purple,
  },
  xpFooter: {
    color: "#92909C",
    fontSize: 10,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  sectionAccent: {
    color: purple,
    fontSize: 9,
    fontWeight: "800",
  },
  mission: {
    backgroundColor: "#201B2D",
    borderWidth: 1,
    borderColor: "#403452",
    borderRadius: 20,
    padding: 19,
    marginBottom: 34,
  },
  missionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#382B50",
    alignItems: "center",
    justifyContent: "center",
  },
  missionIconText: {
    color: "#C7B5FF",
    fontSize: 22,
  },
  reward: {
    color: "#C6B3FF",
    fontSize: 11,
    fontWeight: "800",
  },
  categoryLabel: {
    color: "#B69AFB",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginTop: 21,
  },
  missionTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 9,
  },
  missionDescription: {
    color: "#AAA5B7",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  button: {
    backgroundColor: purple,
    borderRadius: 11,
    padding: 14,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 18,
    marginLeft: 9,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 11,
  },
  categoryCard: {
    width: "48%",
    minHeight: 115,
    backgroundColor: "#19181F",
    borderWidth: 1,
    borderColor: "#2B2933",
    borderRadius: 16,
    padding: 14,
  },
  number: {
    color: purple,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 13,
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  categoryDesc: {
    color: "#92909C",
    fontSize: 10,
    marginTop: 5,
  },
  footer: {
    alignItems: "center",
    marginTop: 38,
  },
  footerLogo: {
    color: purple,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 2,
  },
  footerText: {
    color: "#92909C",
    fontSize: 10,
    marginTop: 5,
  },
});
