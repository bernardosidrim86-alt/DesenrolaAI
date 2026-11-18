import { supabase } from '@/lib/supabase';

export type MissionOption = {
  id: string;
  text: string;
};

export type LearningMission = {
  id: string;
  journey_id: string | null;
  category: string;
  title: string;
  description: string;
  reward_xp: number;
  lesson_content: string;
  question: string;
  options: MissionOption[];
  correct_option: string | null;
  explanation: string;
  estimated_minutes: number;
  sort_order: number;
};

export type LearningJourney = {
  id: string;
  title: string;
  category: string;
  description: string;
  sort_order: number;
};

export type LearningCatalog = {
  journeys: LearningJourney[];
  missions: LearningMission[];
  completedMissionIds: string[];
};

export async function loadLearningCatalog(userId: string): Promise<LearningCatalog> {
  const [journeysResult, missionsResult, completionsResult] = await Promise.all([
    supabase
      .from('journeys')
      .select('id, title, category, description, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('missions')
      .select('id, journey_id, category, title, description, reward_xp, lesson_content, question, options, correct_option, explanation, estimated_minutes, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('mission_completions')
      .select('mission_id')
      .eq('user_id', userId),
  ]);

  if (journeysResult.error) throw journeysResult.error;
  if (missionsResult.error) throw missionsResult.error;
  if (completionsResult.error) throw completionsResult.error;

  return {
    journeys: (journeysResult.data ?? []) as LearningJourney[],
    missions: (missionsResult.data ?? []) as LearningMission[],
    completedMissionIds: (completionsResult.data ?? []).map((row) => row.mission_id),
  };
}
