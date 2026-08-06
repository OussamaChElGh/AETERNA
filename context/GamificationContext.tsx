'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, Flame, Award, X, Compass, User, BookOpen, Crown, BrainCircuit, Map, AlertTriangle, Scroll, Fingerprint, Zap } from "lucide-react";
import { useAuth } from "./AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FeedbackOverlay } from "@/components/FeedbackOverlay";
import fisicaCurriculum from "@/data/curriculum/fisica.json";
import relicData from "@/data/relics.json";
import { evaluateRoomUnlocks } from "@/lib/roomEngineStorage";
import { ROOM_ENGINE_CATALOG } from "@/data/roomEngineCatalog";
import { RoomCatalogItem } from "@/types/roomEngine";

// Cache global para assets combinados
let combinedCatalogCache: RoomCatalogItem[] | null = null;
let combinedCacheTimestamp = 0;
const COMBINED_CACHE_DURATION = 30000; // 30 segundos

async function fetchCombinedCatalog(): Promise<RoomCatalogItem[]> {
  const now = Date.now();
  if (combinedCatalogCache && (now - combinedCacheTimestamp) < COMBINED_CACHE_DURATION) {
    return combinedCatalogCache;
  }
  
  try {
    const res = await fetch('/api/assets/combined');
    if (res.ok) {
      const data = await res.json();
      combinedCatalogCache = data.catalog;
      combinedCacheTimestamp = now;
      return data.catalog;
    }
  } catch (error) {
    console.error('Error fetching combined catalog:', error);
  }
  
  return ROOM_ENGINE_CATALOG;
}

/**
 * Devuelve el lunes de la semana actual a las 00:00 (UTC) como ISO string.
 * Se usa para el ranking semanal: la semana se reinicia cada lunes.
 */
export function getMondayKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0=domingo ... 6=sábado
  const diff = (day + 6) % 7; // días desde el lunes
  d.setUTCDate(d.getUTCDate() - diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export interface UserProgress {
  xp: number;
  level: number;
  completedPaths: string[];
  unlockedRoadmaps: string[];
  articleProgress?: Record<string, number>;
  selectedAvatarId?: string;
  dailyStreak: number;
  lastActiveDate: string;
  achievements: string[];
  answeredQuestions: string[];
  physicsRelics: string[];
  completedLayers?: Record<string, string[]>;
  alias?: string;
  displayName?: string;
  photoURL?: string;
  weeklyXp?: number;
  weeklyResetDate?: string;
  hearts: number;
  maxHearts: number;
  lastHeartRegenDate?: string;
}

export type NotificationType = 'level_up' | 'achievement' | 'streak' | 'xp' | 'warning';

export type FeedbackEventType = 'correct' | 'wrong' | 'relic' | 'level_up' | 'combo';

export interface FeedbackEvent {
  id: string;
  type: FeedbackEventType;
  xp?: number;
  sourceId?: string;
  x?: number;
  y?: number;
  relicName?: string;
  level?: number;
  combo?: number;
}

export interface Telemetry {
  timeSpent: number; // in milliseconds
  wordCount: number;
  velocity: number; // maximum scroll velocity captured
}

export interface GamificationNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  points?: number;
}

interface GamificationContextType {
  progress: UserProgress;
  addXP: (amount: number, reason?: string) => void;
  completePath: (pathId: string, telemetry?: Telemetry) => void;
  isCompleted: (pathId: string) => boolean;
  getArticleProgress: (articleId: string) => number;
  selectAvatar: (avatarId: string) => void;
  updateArticleProgress: (articleId: string, progress: number, telemetry?: Telemetry) => void;
  markQuestionAnswered: (questionId: string, xpAmount?: number, reason?: string) => void;
  hasAnsweredQuestion: (questionId: string) => boolean;
  unlockLayerPoster: (articleId: string, capa: string) => void;
  completeLayer: (articleId: string, capa: string) => void;
  combo: number;
  breakCombo: () => void;
  unlockAchievement: (id: string) => void;
  resetProgress: () => void;
  setAlias: (alias: string) => void;
  fireFeedback: (ev: Omit<FeedbackEvent, 'id'>) => void;
  feedbackEvent: FeedbackEvent | null;
  loseHeart: () => void;
  regenerateHearts: () => void;
}

const defaultProgress: UserProgress = {
  xp: 0,
  level: 1,
  completedPaths: [],
  unlockedRoadmaps: ["ciencias_formales", "ciencias_naturales", "ciencias_sociales", "humanidades", "artes", "aplicadas"],
  articleProgress: {},
  selectedAvatarId: 'novice',
  dailyStreak: 0,
  lastActiveDate: "",
  achievements: [],
  answeredQuestions: [],
  physicsRelics: [],
  completedLayers: {},
  alias: '',
  displayName: '',
  photoURL: '',
  weeklyXp: 0,
  weeklyResetDate: getMondayKey(),
  hearts: 4,
  maxHearts: 4,
  lastHeartRegenDate: '',
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const formatXP = (xp: number): string => {
  if (xp >= 10000) {
    return (xp / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return xp.toString();
};

export const calculateProgressToNextLevel = (totalXp: number) => {
  // Logarithmic scaling: Level = 1 + floor(log_multiplier(XP/xpBase + 1))
  // Target: Level 100 at ~860,000 XP (Total possible from 1,911 articles)
  
  const xpBase = 15000;
  const multiplier = 1.0415;
  
  // Calculate Level directly
  const level = Math.floor(Math.log(totalXp / xpBase + 1) / Math.log(multiplier)) + 1;
  
  // Calculate total XP needed for THIS level and NEXT level
  // Formula: TotalXP = xpBase * (multiplier^(Level-1) - 1)
  const xpForCurrentLevelTotal = Math.floor(xpBase * (Math.pow(multiplier, level - 1) - 1));
  const xpForNextLevelTotal = Math.floor(xpBase * (Math.pow(multiplier, level) - 1));
  
  const currentLevelXp = totalXp - xpForCurrentLevelTotal;
  const xpForNextLevel = xpForNextLevelTotal - xpForCurrentLevelTotal;
  
  return {
    level,
    currentLevelXp,
    xpForNextLevel
  };
};

export const AVATARS = [
  { 
    id: 'novice', 
    name: 'Novice', 
    requiredLevel: 1, 
    color: 'blue',
    image: 'https://res.cloudinary.com/dagk9k1un/image/upload/v1778102919/avatar-1_ioyj8r.jpg',
    icon: User 
  },
  { 
    id: 'guardian_anektia', 
    name: 'Guardián Anektia', 
    requiredLevel: 5, 
    color: 'gold-intense',
    image: '/mascot.png',
    icon: Crown 
  },
  { 
    id: 'aspirant', 
    name: 'Aspirant', 
    requiredLevel: 5, 
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4648c?auto=format&fit=crop&q=80&w=400',
    icon: Scroll 
  },
  { 
    id: 'apprentice', 
    name: 'Apprentice', 
    requiredLevel: 10, 
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
    icon: BookOpen 
  },
  { 
    id: 'disciple', 
    name: 'Disciple', 
    requiredLevel: 20, 
    color: 'cyan',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400',
    icon: Fingerprint 
  },
  { 
    id: 'scholar', 
    name: 'Scholar', 
    requiredLevel: 30, 
    color: 'gold-cyan',
    image: 'https://images.unsplash.com/photo-1532012197367-6849fd12ec01?auto=format&fit=crop&q=80&w=400',
    icon: Award 
  },
  { 
    id: 'savant', 
    name: 'Savant', 
    requiredLevel: 45, 
    color: 'gold',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    icon: BrainCircuit 
  },
  { 
    id: 'master', 
    name: 'Master', 
    requiredLevel: 60, 
    color: 'gold-intense',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=400',
    icon: Crown 
  },
  { 
    id: 'oracle', 
    name: 'Oracle', 
    requiredLevel: 80, 
    color: 'divine',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
    icon: Zap 
  },
  { 
    id: 'grandmaster', 
    name: 'Grandmaster', 
    requiredLevel: 100, 
    color: 'radiant',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a67e0621?auto=format&fit=crop&q=80&w=400',
    icon: Star 
  },
];

import { ROADMAPS } from "@/data/roadmaps";

export const ACHIEVEMENTS: Record<string, { title: string; description: string; xp: number; icon: React.ElementType }> = {
  first_steps: { title: "El Primer Paso", description: "Inicia la lectura de tu primera guía", xp: 50, icon: Compass },
  first_blood: { title: "Primera Sangre", description: "Completa tu primer objetivo", xp: 100, icon: Star },
  reader: { title: "Lector Voraz", description: "Termina de leer un artículo al 100%", xp: 200, icon: Award },
  streak_3: { title: "Llama Naciente", description: "Mantén una racha de 3 días", xp: 300, icon: Flame },
  streak_7: { title: "Fuego Inextinguible", description: "Mantén una racha de 7 días", xp: 1000, icon: Flame },
  level_5: { title: "Aprendiz Avanzado", description: "Alcanza el nivel 5", xp: 500, icon: Trophy },
  critical_mind: { title: "Mente Crítica", description: "Responde 10 preguntas interactivas correctamente.", xp: 300, icon: BrainCircuit },
  explorer: { title: "Explorador", description: "Lee 5 guías distintas.", xp: 400, icon: Map },
  pensador_cientifico_1: { title: "Pensador Científico I", description: "Completa la misión: ¿Qué es la ciencia? con éxito.", xp: 120, icon: BrainCircuit },
  fisica_primer_hallazgo: { title: "Primera Reliquia", description: "Descubre tu primera reliquia física", xp: 100, icon: Zap },
  fisica_cazador_reliquias: { title: "Cazador de Reliquias", description: "Colecciona 2 reliquias físicas", xp: 300, icon: Crown },
  fisica_coleccionista: { title: "Coleccionista del Cosmos", description: "Completa la colección de 4 reliquias físicas", xp: 1200, icon: Award },
  fisica_capa_asimilada: { title: "Capa Asimilada", description: "Domina las 3 capas de un mismo artículo", xp: 300, icon: BrainCircuit },
};

// Dinámicamente añadir recompensas de nivel
Object.entries(ROADMAPS).forEach(([categoryKey, roadmap]) => {
  roadmap.steps.forEach(step => {
    const levelNum = step.level?.num || 1;
    const badgeName = step.level?.badge || "Explorador";
    const id = `level_badge_${categoryKey}_${step.id}_${levelNum}`.toLowerCase().replace(/\s+/g, '_');
    if (!ACHIEVEMENTS[id]) {
      ACHIEVEMENTS[id] = {
         title: badgeName,
         description: `Superó el Examen del artículo: ${step.title}.`,
         xp: 500,
         icon: Trophy
      };
    }
  });
});

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<GamificationNotification[]>([]);
  const [feedbackEvent, setFeedbackEvent] = useState<FeedbackEvent | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireFeedback = useCallback((ev: Omit<FeedbackEvent, 'id'>) => {
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    setFeedbackEvent({ ...ev, id: `${ev.type}_${Date.now()}` });
    feedbackTimeout.current = setTimeout(() => setFeedbackEvent(null), 2200);
  }, []);
  const { user } = useAuth();
  const syncedFirebase = useRef(false);
  
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("aeterna_progress_v3");
        if (stored) {
          const parsed = JSON.parse(stored);
          setProgress({
            ...defaultProgress,
            ...parsed,
            dailyStreak: parsed.dailyStreak || 0,
            lastActiveDate: parsed.lastActiveDate || "",
            achievements: parsed.achievements || [],
          });
        }
      }
    } catch (e) {
      console.warn("Could not read progress from local storage.");
    }
  }, []);

  const stateRef = useRef<UserProgress>(progress);
  const comboRef = useRef(0);
  const [combo, setCombo] = useState(0);
  const notifiedKeys = useRef(new Set<string>());

  // Initial population of notified keys to prevent old notifications on reload
  useEffect(() => {
    progress.achievements.forEach(id => notifiedKeys.current.add(`ach_notif_${id}`));
    progress.completedPaths.forEach(id => {
      notifiedKeys.current.add(`path_xp_${id}`);
      notifiedKeys.current.add(`read_xp_${id.replace('article_read_', '')}`);
    });
  }, []);

  // Pull from Firebase when user logs in
  useEffect(() => {
    if (!user) {
      syncedFirebase.current = false;
      return;
    }

    const loadData = async () => {
      try {
        const ref = doc(db, "aeternaProgressV3", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const cloudData = snap.data() as UserProgress;
          
          // Seed notified keys with cloud data before setting progress
          cloudData.achievements?.forEach(id => notifiedKeys.current.add(`ach_notif_${id}`));
          cloudData.completedPaths?.forEach(id => {
            notifiedKeys.current.add(`path_xp_${id}`);
            notifiedKeys.current.add(`read_xp_${id.replace('article_read_', '')}`);
          });

          // Rellenar displayName/photoURL desde la sesión de Auth si faltan,
          // para que el ranking tenga nombre aunque el usuario no haya fijado alias.
          // Si Google no devuelve nombre, usamos el email como nombre visible.
          const sessionName = user.displayName || (user.email ? user.email.split('@')[0] : '') || '';
          const enriched = {
            ...cloudData,
            displayName: cloudData.displayName || sessionName,
            photoURL: cloudData.photoURL || user.photoURL || ''
          };

          setProgress({
            ...defaultProgress,
            ...enriched
          });

          // Si faltaban, persistir la versión enriquecida una vez
          if (!cloudData.displayName || !cloudData.photoURL) {
            try {
              await setDoc(doc(db, "aeternaProgressV3", user.uid), { ...enriched, ownerId: user.uid }, { merge: true });
            } catch (e) {
              // Best-effort: si falla la escritura del nombre, no bloquear el
              // progreso del usuario; se reintentará en el próximo login.
              console.warn('Gamification: no se pudo enriquecer displayName/photoURL', e);
            }
          }
        } else {
          // No existe documento en Firestore aún: crear uno con el progreso
          // local + datos de la sesión, para que el usuario aparezca en el
          // cuadro de clasificación aunque nunca haya cambiado el progreso.
          try {
            const sessionName = user.displayName || (user.email ? user.email.split('@')[0] : '') || '';
            await setDoc(
              doc(db, "aeternaProgressV3", user.uid),
              { ...progress, displayName: progress.displayName || sessionName, photoURL: progress.photoURL || user.photoURL || '', ownerId: user.uid },
              { merge: true }
            );
          } catch (e) {
            // Best-effort: si falla, el progreso se guardará en el siguiente cambio
            console.warn('Gamification: no se pudo crear el documento inicial', e);
          }
        }
        syncedFirebase.current = true;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `aeternaProgressV3/${user.uid}`);
      }
    };
    loadData();
  }, [user]);

  // Persist to LocalStorage AND Firebase whenever progress updates
  useEffect(() => {
    localStorage.setItem("aeterna_progress_v3", JSON.stringify(progress));
    stateRef.current = progress;
    
    if (user && syncedFirebase.current) {
      const saveToCloud = async () => {
        try {
          // Forzar displayName/photoURL desde la sesión de Auth en cada guardado.
          // Corrige documentos antiguos que quedaron sin nombre (Sabio Anónimo).
          const sessionName = user.displayName || (user.email ? user.email.split('@')[0] : '') || '';
          const payload = {
            ...progress,
            displayName: progress.displayName || sessionName,
            photoURL: progress.photoURL || user.photoURL || '',
            ownerId: user.uid
          };
          await setDoc(doc(db, "aeternaProgressV3", user.uid), payload);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `aeternaProgressV3/${user.uid}`);
        }
      };
      saveToCloud();
    }
  }, [progress, user]);

  const notify = useCallback((notification: Omit<GamificationNotification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000); // Increased duration to 6s
  }, []);

  const notifyOnce = useCallback((key: string, notification: Omit<GamificationNotification, 'id'>) => {
    if (notifiedKeys.current.has(key)) return;
    
    // Extra safety: check if progress already contains the underlying milestone
    if (key.includes('ach_') && progress.achievements.some(a => key.includes(a))) return;
    if (key.includes('path_') && progress.completedPaths.some(p => key.includes(p))) return;
    if (key.includes('read_') && progress.completedPaths.includes(`article_read_${key.split('read_xp_')[1]}`)) return;

    notifiedKeys.current.add(key);
    notify(notification);
  }, [notify, progress.achievements, progress.completedPaths]);

  // Dedicated effect to handle achievement notifications as they are added to the state
  useEffect(() => {
    progress.achievements.forEach(id => {
      const key = `ach_notif_${id}`;
      if (!notifiedKeys.current.has(key)) {
        notifiedKeys.current.add(key);
        const ach = ACHIEVEMENTS[id];
        if (ach) {
          notify({
            type: 'achievement',
            title: "¡Logro Desbloqueado!",
            message: ach.title,
            points: ach.xp
          });
        }
      }
    });
  }, [progress.achievements, notify]);

  // Check login streak and regenerate hearts daily
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    let streakUpdated = false;
    let newStreakValue = 0;
    let streakPoints = 0;
    
    setProgress(prev => {
      // First, handle Daily Heart Regeneration even if already logged in for XP purposes
      let nextState = { ...prev };
      let updatedState = false;
      
      if (!prev.lastHeartRegenDate || prev.lastHeartRegenDate.split('T')[0] !== todayStr) {
        if (prev.hearts < prev.maxHearts) {
          nextState.hearts = prev.maxHearts;
          nextState.lastHeartRegenDate = todayStr;
          updatedState = true;
        } else if (!prev.lastHeartRegenDate) {
          nextState.lastHeartRegenDate = todayStr;
          updatedState = true;
        }
      }
      
      if (prev.lastActiveDate === todayStr) {
        return updatedState ? nextState : prev; // Already logged in today
      }
      
      let newStreak = prev.dailyStreak;
      
      if (prev.lastActiveDate) {
        const lastDate = new Date(prev.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          // Consecutive day
          newStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
      } else {
        // First login ever
        newStreak = 1;
      }
      
      nextState.dailyStreak = newStreak;
      nextState.lastActiveDate = todayStr;
      
      if (newStreak > prev.dailyStreak) {
        streakUpdated = true;
        newStreakValue = newStreak;
        streakPoints = 50 * newStreak;
        nextState.xp = prev.xp + streakPoints;
      }
      
      return nextState;
    });
    
    if (streakUpdated) {
      let title = "¡Racha diaria!";
      let message = `Llevas ${newStreakValue} ${newStreakValue === 1 ? 'día' : 'días'} consecutivos aprendiendo.`;
      setTimeout(() => notifyOnce(`streak_${todayStr}`, { type: 'streak', title, message, points: streakPoints }), 1500);
    }
  }, [notify]);

  // Check for level ups and achievements after XP change
  useEffect(() => {
    const { level: expectedLevel } = calculateProgressToNextLevel(progress.xp);
    
    if (expectedLevel > progress.level) {
      notify({
        type: 'level_up',
        title: "¡Nivel Ascendido!",
        message: `Has alcanzado el Nivel ${expectedLevel}. Tu conocimiento se expande.`,
      });

      fireFeedback({ type: 'level_up', level: expectedLevel });
      
      setProgress(prev => ({ ...prev, level: expectedLevel }));
    }

    // Check streak achievements
    if (progress.dailyStreak >= 3 && !progress.achievements.includes('streak_3')) {
      unlockAchievement('streak_3');
    }
    if (progress.dailyStreak >= 7 && !progress.achievements.includes('streak_7')) {
      unlockAchievement('streak_7');
    }
    // Check level achievements
    if (progress.level >= 5 && !progress.achievements.includes('level_5')) {
      unlockAchievement('level_5');
    }
  }, [progress.xp, progress.level, progress.dailyStreak, progress.achievements, notify, fireFeedback]);

  const unlockAchievement = useCallback((achievementId: string) => {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;

    setProgress(prev => {
      if (prev.achievements.includes(achievementId)) return prev;
      return { 
        ...prev, 
        achievements: [...prev.achievements, achievementId],
        xp: prev.xp + achievement.xp 
      };
    });
  }, []);

  const addXP = useCallback((baseAmount: number, reason?: string) => {
    const currentStreak = stateRef.current.dailyStreak;
    const multiplier = 1 + 0.05 * Math.max(0, currentStreak - 1);
    const amount = Math.round(baseAmount * multiplier);

    if (amount > 0 && reason) {
      // Use a timestamp or a generic key for XP notifications to allow multiple per session
      // but deduplicate rapid identical triggers if needed. 
      // XP is less critical for exact one-time-key than achievements.
      notify({
        type: 'xp',
        title: "+ Experiencia",
        message: `${reason} (x${multiplier.toFixed(2)})`,
        points: amount
      });
    }

    setProgress((prev) => {
      // Lógica del ranking semanal: se reinicia cada lunes.
      const thisMonday = getMondayKey();
      const isNewWeek = prev.weeklyResetDate !== thisMonday;
      const weeklyXp = isNewWeek ? amount : (prev.weeklyXp || 0) + amount;
      return {
        ...prev,
        xp: prev.xp + amount,
        weeklyXp,
        weeklyResetDate: thisMonday
      };
    });
  }, [notify]);

  const completePath = useCallback(async (pathId: string, telemetry?: Telemetry) => {
    if (stateRef.current.completedPaths.includes(pathId)) return;

    // Anticheat check for article-based paths (DISABLED)
    /*
    if (telemetry) {
      const minSecondsPer100Words = 7;
      const minTimeRequired = (telemetry.wordCount / 100) * minSecondsPer100Words * 1000;
      const absoluteMinTime = 15000;
      
      const isTooFast = telemetry.timeSpent < Math.max(minTimeRequired, absoluteMinTime);
      if (isTooFast) {
        notify({
          type: 'warning',
          title: "Lectura Superficial",
          message: "Has avanzado demasiado rápido. La sabiduría requiere tiempo de reflexión.",
        });
        return;
      }
    }
    */

    // Cargar catálogo combinado antes de la evaluación
    const catalog = await fetchCombinedCatalog();

    setProgress((prev) => {
      if (prev.completedPaths.includes(pathId)) return prev;
      
      let newXp = prev.xp;
      const newCompletedPaths = [...prev.completedPaths, pathId];
      const newAchievements = [...prev.achievements];

      const baseAmount = 500;
      const multiplier = 1 + 0.05 * Math.max(0, prev.dailyStreak - 1);
      const amount = Math.round(baseAmount * multiplier);
      newXp += amount;
      
      notifyOnce(`path_xp_${pathId}`, { 
        type: 'xp', 
        title: "+ Experiencia",
        message: `Ruta completada (x${multiplier.toFixed(2)})`,
        points: amount 
      });

      // Evaluación de desbloqueos del Room Engine (catálogo nuevo)
      const ctx = {
        completedPaths: newCompletedPaths,
        completedLayers: prev.completedLayers || {},
        userId: user?.uid,
        userEmail: user?.email
      };
      const { unlockedIds } = evaluateRoomUnlocks(ctx);
      const newlyUnlocked = catalog.filter(item => unlockedIds.has(item.id));
      newlyUnlocked.forEach(item => {
        notifyOnce(`room_unlock_${item.id}`, {
          type: 'achievement',
          title: "¡Objeto / Mueble Desbloqueado!",
          message: `${item.name}: Añadido a tu Habitación del Conocimiento`,
          points: 100
        });
      });
      
      if (!prev.achievements.includes('first_blood')) {
        newAchievements.push('first_blood');
        // Achievement notification is handled by the useEffect watching achievements
      }

      // Evaluar reliquias por nivel: un nivel se completa cuando TODOS sus
      // artículos están en completedPaths. Al completarlo, se registra la
      // reliquia y se otorgan los logros de coleccionista.
      const articlesByNivel: Record<number, string[]> = {};
      for (const a of (fisicaCurriculum as { articles?: { slug: string; nivel: number }[] }).articles || []) {
        if (!articlesByNivel[a.nivel]) articlesByNivel[a.nivel] = [];
        articlesByNivel[a.nivel].push(a.slug);
      }
      const newPhysicsRelics = [...(prev.physicsRelics || [])];
      for (const r of (relicData as { relics?: { id: string; unlocksOn: { type: string; nivel?: number } }[] }).relics || []) {
        if (r.unlocksOn.type !== 'nivel_completed') continue;
        const nivel = r.unlocksOn.nivel || 0;
        const slugs = articlesByNivel[nivel] || [];
        if (slugs.length === 0 || newPhysicsRelics.includes(r.id)) continue;
        const nivelDone = slugs.every(slug => newCompletedPaths.includes(slug));
        if (nivelDone) {
          newPhysicsRelics.push(r.id);
          notifyOnce(`relic_${r.id}`, {
            type: 'achievement',
            title: "¡Reliquia Desbloqueada!",
            message: `Has dominado el nivel ${nivel}. Reliquia añadida al Muro.`,
            points: 250
          });
        }
      }

      // Logros de coleccionista basados en el total de reliquias
      if (newPhysicsRelics.length >= 4 && !newAchievements.includes('fisica_coleccionista')) {
        newAchievements.push('fisica_coleccionista');
      } else if (newPhysicsRelics.length >= 2 && !newAchievements.includes('fisica_cazador_reliquias')) {
        newAchievements.push('fisica_cazador_reliquias');
      }
      if (newPhysicsRelics.length >= 1 && !newAchievements.includes('fisica_primer_hallazgo')) {
        newAchievements.push('fisica_primer_hallazgo');
      }
      
      return { 
        ...prev, 
        xp: newXp,
        completedPaths: newCompletedPaths,
        achievements: newAchievements,
        physicsRelics: newPhysicsRelics
      };
    });
  }, [notifyOnce]);

  const isCompleted = useCallback((pathId: string) => {
    return progress.completedPaths.includes(pathId);
  }, [progress.completedPaths]);

  const updateArticleProgress = useCallback((articleId: string, percentage: number, telemetry?: Telemetry) => {
    const current = stateRef.current;
    const currentArtProgress = current.articleProgress?.[articleId] || 0;
    
    // Anticheat check for completion (DISABLED)
    /*
    if (percentage >= 95 && currentArtProgress < 95 && telemetry) {
      const minSecondsPer100Words = 7; // Extremely fast reading speed (approx 850 wpm)
      const minTimeRequired = (telemetry.wordCount / 100) * minSecondsPer100Words * 1000;
      
      // Minimum absolute time for any article (prevents fast-forwarding very short texts)
      const absoluteMinTime = 15000; 
      
      const isTooFast = telemetry.timeSpent < Math.max(minTimeRequired, absoluteMinTime);
      const isJumpScroll = telemetry.velocity > 0.8; // High instantaneous velocity detection

      if (isTooFast || isJumpScroll) {
        notify({
          type: 'warning',
          title: "Lectura Superficial",
          message: "Has avanzado demasiado rápido. Profundiza más en el contenido para obtener sabiduría.",
        });
        return; // Reject progress update to 100%
      }
    }
    */

    if (currentArtProgress >= percentage) return;

    setProgress((prev) => {
      const innerCurrent = prev.articleProgress?.[articleId] || 0;
      if (innerCurrent >= percentage) return prev;

      let newXp = prev.xp;
      const newCompletedPaths = [...prev.completedPaths];
      const newAchievements = [...prev.achievements];
      
      const completionThreshold = 95;
      const isNowCompleted = percentage >= completionThreshold && innerCurrent < completionThreshold && !prev.completedPaths.includes(`article_read_${articleId}`);

      const newProgressMap = { ...(prev.articleProgress || {}), [articleId]: percentage };

      if (isNowCompleted) {
        newCompletedPaths.push(`article_read_${articleId}`);
        
        const baseAmount = 450;
        const multiplier = 1 + 0.05 * Math.max(0, prev.dailyStreak - 1);
        const amount = Math.round(baseAmount * multiplier);
        newXp += amount;
        
        notifyOnce(`read_xp_${articleId}`, { 
          type: 'xp', 
          title: "+ Experiencia",
          message: `Lectura completada (x${multiplier.toFixed(2)})`,
          points: amount 
        });

        if (!prev.achievements.includes('reader')) {
          newAchievements.push('reader');
          newXp += ACHIEVEMENTS['reader'].xp;
        }
        
        const completedCount = Object.values(newProgressMap).filter(p => p >= completionThreshold).length;
        if (completedCount >= 5 && !prev.achievements.includes('explorer')) {
           newAchievements.push('explorer');
           newXp += ACHIEVEMENTS['explorer'].xp;
        }
      }

      if (percentage >= 10 && innerCurrent < 10) {
        if (!prev.achievements.includes('first_steps')) {
          newAchievements.push('first_steps');
          newXp += ACHIEVEMENTS['first_steps'].xp;
        }
      }

      return { 
        ...prev, 
        xp: newXp,
        articleProgress: newProgressMap,
        completedPaths: newCompletedPaths,
        achievements: newAchievements
      };
    });
  }, [notifyOnce]);

  const getArticleProgress = useCallback((articleId: string) => {
    return progress.articleProgress?.[articleId] || 0;
  }, [progress.articleProgress]);

  const selectAvatar = useCallback((avatarId: string) => {
    setProgress(prev => {
      const avatar = AVATARS.find(a => a.id === avatarId);
      if (avatar && prev.level >= avatar.requiredLevel) {
        return { ...prev, selectedAvatarId: avatarId };
      }
      return prev;
    });
  }, []);

  const markQuestionAnswered = useCallback((questionId: string, xpAmount?: number, reason?: string) => {
    if (stateRef.current.answeredQuestions.includes(questionId)) return;

    comboRef.current += 1;
    setCombo(comboRef.current);
    const comboBonus = Math.min(comboRef.current, 10);

    if (comboRef.current >= 2) {
      fireFeedback({ type: 'combo', combo: comboRef.current, sourceId: questionId });
    }

    let finalAmount = 0;
    let finalMultiplier = 1;

    setProgress((prev) => {
      if (prev.answeredQuestions.includes(questionId)) return prev;
      
      let newXp = prev.xp;
      const newAnswers = [...prev.answeredQuestions, questionId];
      const newAchievements = [...prev.achievements];

      if (xpAmount) {
        finalMultiplier = 1 + 0.05 * Math.max(0, prev.dailyStreak - 1);
        finalAmount = Math.round(xpAmount * finalMultiplier) + comboBonus;
        newXp += finalAmount;
      }
      
      if (newAnswers.length === 10 && !prev.achievements.includes('critical_mind')) {
        newAchievements.push('critical_mind');
      }
      
      return { 
        ...prev, 
        xp: newXp,
        answeredQuestions: newAnswers,
        achievements: newAchievements
      };
    });

    if (xpAmount && finalAmount > 0) {
      notifyOnce(`question_xp_${questionId}`, { 
        type: 'xp', 
        title: "+ Experiencia",
        message: comboBonus > 0
          ? `${reason || 'Pregunta Respondida'} · Cadena x${comboRef.current} (x${finalMultiplier.toFixed(2)})`
          : `${reason || 'Pregunta Respondida'} (x${finalMultiplier.toFixed(2)})`,
        points: finalAmount 
      });
    }
  }, [notifyOnce, fireFeedback]);

  const breakCombo = useCallback(() => {
    comboRef.current = 0;
    setCombo(0);
  }, []);

  /**
   * Desbloquea el mueble asociado a una capa completada.
   * Usa el catálogo del Room Engine (catálogo nuevo).
   */
  const unlockLayerPoster = useCallback(async (articleId: string, capa: string) => {
    const ctx = {
      completedPaths: stateRef.current.completedPaths,
      completedLayers: { ...(stateRef.current.completedLayers || {}), [articleId]: [...((stateRef.current.completedLayers || {})[articleId] || []), capa] },
      userId: user?.uid,
      userEmail: user?.email
    };
    const { unlockedIds } = evaluateRoomUnlocks(ctx);
    const catalog = await fetchCombinedCatalog();
    const newlyUnlocked = catalog.filter(item => unlockedIds.has(item.id));
    newlyUnlocked.forEach(item => {
      notifyOnce(`poster_unlock_${item.id}`, {
        type: 'achievement',
        title: "¡Hallazgo desbloqueado!",
        message: `${item.name}: Añadido a tu sala como objeto`,
        points: 75
      });
    });
  }, [notifyOnce, user?.uid, user?.email]);

  const completeLayer = useCallback((articleId: string, capa: string) => {
    if (stateRef.current.completedLayers?.[articleId]?.includes(capa)) return;

    let finalAmount = 0;
    let finalMultiplier = 1;

    setProgress((prev) => {
      const layers = prev.completedLayers?.[articleId] || [];
      if (layers.includes(capa)) return prev;
      const newLayers = [...layers, capa];

      let newXp = prev.xp;
      const newAchievements = [...prev.achievements];

      if (newLayers.length >= 3) {
        finalMultiplier = 1 + 0.05 * Math.max(0, prev.dailyStreak - 1);
        finalAmount = Math.round(150 * finalMultiplier);
        newXp += finalAmount;

        if (!newAchievements.includes('fisica_capa_asimilada')) {
          newAchievements.push('fisica_capa_asimilada');
          newXp += ACHIEVEMENTS['fisica_capa_asimilada'].xp;
        }
      }

      return {
        ...prev,
        xp: newXp,
        completedLayers: { ...(prev.completedLayers || {}), [articleId]: newLayers },
        achievements: newAchievements
      };
    });

    // Unlock the poster for this specific article+capa if a relic is defined
    unlockLayerPoster(articleId, capa);

    if (finalAmount > 0) {
      notifyOnce(`layer_xp_${articleId}_${capa}`, {
        type: 'xp',
        title: "+ Experiencia",
        message: `Capa Asimilada: ${articleId} (x${finalMultiplier.toFixed(2)})`,
        points: finalAmount
      });
    }
  }, [notifyOnce, unlockLayerPoster]);

  const hasAnsweredQuestion = useCallback((questionId: string) => {
    return progress.answeredQuestions.includes(questionId);
  }, [progress.answeredQuestions]);

  const publicUnlockAchievement = useCallback((id: string) => {
    // Only unlock if we don't already have it
    if (!progress.achievements.includes(id)) {
      unlockAchievement(id);
    }
  }, [progress.achievements, unlockAchievement]);

  const resetProgress = useCallback(() => {
    const emptyProgress: UserProgress = {
      xp: 0,
      level: 1,
      completedPaths: [],
      unlockedRoadmaps: ["ciencias_formales", "ciencias_naturales", "ciencias_sociales", "humanidades", "artes", "aplicadas"],
      articleProgress: {},
      selectedAvatarId: 'novice',
      dailyStreak: 0,
      lastActiveDate: "",
      achievements: [],
      answeredQuestions: [],
      physicsRelics: [],
      completedLayers: {},
      alias: '',
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
      weeklyXp: 0,
      weeklyResetDate: getMondayKey(),
    };
    setProgress(emptyProgress);
    if (user) {
      const saveReset = async () => {
        try {
          const userRef = doc(db, 'aeternaProgressV3', user.uid);
          await setDoc(userRef, { ...emptyProgress, ownerId: user.uid });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `aeternaProgressV3/${user.uid}`);
        }
      };
      saveReset();
    }
  }, [user]);

  const setAlias = useCallback((alias: string) => {
    const clean = alias.trim().slice(0, 20);
    setProgress(prev => ({ ...prev, alias: clean }));
  }, []);

  const loseHeart = useCallback(() => {
    setProgress(prev => {
      if (prev.hearts <= 0) return prev;
      return { ...prev, hearts: prev.hearts - 1 };
    });
  }, []);

  const regenerateHearts = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      hearts: prev.maxHearts,
      lastHeartRegenDate: new Date().toISOString()
    }));
  }, []);

  return (
    <GamificationContext.Provider value={{ 
      progress, 
      addXP, 
      completePath, 
      isCompleted, 
      updateArticleProgress, 
      getArticleProgress, 
      selectAvatar, 
      markQuestionAnswered, 
      hasAnsweredQuestion,
      unlockLayerPoster,
      completeLayer,
      combo,
      breakCombo,
      unlockAchievement: publicUnlockAchievement,
      resetProgress,
      setAlias,
      fireFeedback,
      feedbackEvent,
      loseHeart,
      regenerateHearts,
    }}>
      {children}

      <FeedbackOverlay />

      {/* Premium Multi-Notification Toast Container */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-4 pointer-events-none w-[320px] md:w-[380px]">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.2 } }}
              className="group relative bg-brand-ink/95 backdrop-blur-md text-white border border-brand-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] rounded-2xl p-5 flex gap-4 pointer-events-auto overflow-hidden"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent pointer-events-none" />
              
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
                {notif.type === 'level_up' && <Trophy className="w-6 h-6 text-brand-gold animate-bounce" />}
                {notif.type === 'achievement' && <Award className="w-6 h-6 text-brand-gold" />}
                {notif.type === 'streak' && <Flame className="w-6 h-6 text-orange-400" />}
                {notif.type === 'xp' && <Star className="w-6 h-6 text-brand-gold" />}
                {notif.type === 'warning' && <AlertTriangle className="w-6 h-6 text-red-500" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-xs uppercase tracking-[0.2em] mb-1 ${notif.type === 'warning' ? 'text-red-500' : 'text-brand-gold/90'}`}>{notif.title}</h4>
                <p className="text-sm text-brand-offwhite font-medium leading-tight">{notif.message}</p>
                {notif.points && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-brand-gold">
                      +{formatXP(notif.points)} XP
                    </span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 text-brand-offwhite/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Progress bar for auto-close */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 6, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.5 bg-brand-gold/30"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return context;
}