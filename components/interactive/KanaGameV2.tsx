'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, Trophy, Zap, Clock, RotateCcw, Save, Play, ChevronRight, Star } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';

// Data
const kanaQuestions = [
  { romaji: 'ka', answer: 'か', options: ['か', 'カ', 'さ', 'け'], tip: 'か = Hiragana de "ka".' },
  { romaji: 'shi', answer: 'し', options: ['シ', 'し', 'ち', 'つ'], tip: 'し (hiragana) suena "shi".' },
  { romaji: 'tsu', answer: 'つ', options: ['す', 'ツ', 'つ', 'ち'], tip: 'つ = "tsu" en hiragana.' },
  { romaji: 'na', answer: 'ナ', options: ['な', 'ナ', 'ヌ', 'ね'], tip: 'ナ = katakana "na".' },
  { romaji: 'ko', answer: 'コ', options: ['こ', 'ロ', 'コ', 'ユ'], tip: 'コ se usa mucho en préstamos (katakana).' },
  { romaji: 'mi', answer: 'み', options: ['ミ', 'ま', 'み', 'め'], tip: 'み = hiragana "mi".' },
  { romaji: 'ra', answer: 'ラ', options: ['ら', 'ラ', 'ク', 'リ'], tip: 'ラ = katakana "ra".' },
  { romaji: 'yu', answer: 'ゆ', options: ['ゆ', 'ユ', 'よ', 'ya'], tip: 'ゆ = hiragana "yu".' }
];

const usageQuestions = [
  { word: 'sushi', meaning: 'Comida japonesa común', type: 'hira', tip: 'Palabras nativas comunes → hiragana/kanji.' },
  { word: 'terebi', meaning: 'Préstamo de “television”', type: 'kata', tip: 'Préstamos extranjeros → katakana.' },
  { word: 'amerika', meaning: 'Nombre extranjero', type: 'kata', tip: 'Países/nombres extranjeros suelen ir en katakana.' },
  { word: 'kawaii', meaning: 'Adjetivo japonés', type: 'hira', tip: 'Adjetivos japoneses base → hiragana/kanji.' },
  { word: 'konpyuutaa', meaning: 'Préstamo de “computer”', type: 'kata', tip: 'Muy típico de katakana.' },
  { word: 'arigatou', meaning: 'Expresión japonesa', type: 'hira', tip: 'Expresiones nativas → hiragana (o kanji+hiragana).' }
];

const SAVE_KEY = 'kana_game_v2_progress';

export const KanaGameV2 = () => {
  const [screen, setScreen] = useState<'menu' | 'game' | 'end'>('menu');
  const [mode, setMode] = useState<'kana' | 'usage'>('kana');
  const [practice, setPractice] = useState(false);
  const [audio, setAudio] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState(12);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(12);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { addXP } = useGamification();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const saveProgress = (finished = false) => {
    if (practice && finished) return; // don't save or award xp for finish if practice
    
    if (finished && !practice && score > 0) {
       addXP(score, `KanaGame (${mode === 'kana' ? 'Modo 1' : 'Modo 2'}) completado`);
    }

    const payload = {
      mode,
      questions,
      index,
      score,
      streak,
      correct,
      practice,
      audio,
      timePerQuestion,
      finished,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  };

  const loadProgress = () => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      setMode(data.mode);
      setQuestions(data.questions);
      setIndex(data.index);
      setScore(data.score);
      setStreak(data.streak);
      setCorrect(data.correct);
      setPractice(data.practice);
      setAudio(data.audio);
      setTimePerQuestion(data.timePerQuestion);
      
      if (data.finished) {
        setScreen('end');
      } else {
        setScreen('game');
      }
    } catch (e) {
      console.error("Failed to load progress", e);
    }
  };

  const startGame = (isResume = false) => {
    if (!isResume) {
      const newQs = mode === 'kana' ? shuffle(kanaQuestions) : shuffle(usageQuestions);
      setQuestions(newQs);
      setIndex(0);
      setScore(0);
      setStreak(0);
      setCorrect(0);
    }
    setScreen('game');
    setLocked(false);
    setSelectedOption(null);
    setFeedback(null);
    setRemaining(timePerQuestion);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    stopTimer();
    setRemaining(timePerQuestion);
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 0.1) {
          stopTimer();
          handleTimeUp();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  useEffect(() => {
    if (screen === 'game' && !locked) {
      startTimer();
      const q = questions[index];
      if (mode === 'kana') maybeSpeak(q.romaji);
      else maybeSpeak(q.word);
    }
    return () => stopTimer();
  }, [screen, index, locked]);

  const handleTimeUp = () => {
    if (locked) return;
    setLocked(true);
    const q = questions[index];
    const ans = mode === 'kana' ? q.answer : q.type === 'hira' ? 'Hiragana' : 'Katakana';
    
    if (!practice) {
      setStreak(0);
      setScore(prev => Math.max(0, prev - 5));
    }
    
    setFeedback({ ok: false, msg: `⏰ Tiempo agotado. ${q.tip}` });
    setSelectedOption(null);
  };

  const checkAnswer = (val: string) => {
    if (locked) return;
    stopTimer();
    setLocked(true);
    setSelectedOption(val);

    const q = questions[index];
    let isCorrect = false;
    
    if (mode === 'kana') {
      isCorrect = val === q.answer;
    } else {
      const typeLabel = q.type === 'hira' ? 'Hiragana' : 'Katakana';
      isCorrect = val === typeLabel;
    }

    if (isCorrect) {
      setCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
      setScore(prev => prev + 10 + (streak >= 1 ? 5 : 0));
      setFeedback({ ok: true, msg: `¡Correcto! ${q.tip}` });
    } else {
      if (!practice) {
        setStreak(0);
        setScore(prev => Math.max(0, prev - 3));
      }
      setFeedback({ ok: false, msg: `No del todo. ${q.tip}` });
    }
  };

  const maybeSpeak = (text: string) => {
    if (!audio || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const nextQuestion = () => {
    if (index + 1 >= questions.length) {
      setScreen('end');
      saveProgress(true);
    } else {
      setIndex(prev => prev + 1);
      setLocked(false);
      setSelectedOption(null);
      setFeedback(null);
      setRemaining(timePerQuestion);
      saveProgress();
    }
  };

  const clearSave = () => {
    localStorage.removeItem(SAVE_KEY);
    alert('Progrove borrado.');
  };

  const renderStats = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
      <h1 className="text-sm font-bold text-slate-200 hidden sm:block">🎌 Kana V2</h1>
      <div className="flex flex-wrap gap-2">
        <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400">
          Puntos: <b className="text-slate-100">{score}</b>
        </div>
        <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400">
          Racha: <b className="text-slate-100">{streak}</b>
        </div>
        <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400">
          Pregunta: <b className="text-slate-100">{index + 1}/{questions.length}</b>
        </div>
        <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400 min-w-[70px]">
          Tiempo: <b className="text-slate-100">{remaining.toFixed(1)}s</b>
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-8 w-full font-sans antialiased text-slate-100">
      <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header bar */}
        <div className="p-1 px-4 bg-slate-900 border-b border-slate-800 flex justify-end gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
        </div>

        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            {screen === 'menu' && (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Configura tu partida</h2>
                  <p className="text-slate-400 text-sm">Elige un modo y activa opciones avanzadas para perfeccionar tu japonés.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setMode('kana')}
                    className={`text-left p-6 rounded-2xl border-2 transition-all group ${
                      mode === 'kana' 
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className={`w-5 h-5 ${mode === 'kana' ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="font-bold">Modo 1: Construye la sílaba</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">Te doy el rōmaji y debes elegir el kana (Hiragana/Katakana) correcto.</p>
                  </button>

                  <button 
                    onClick={() => setMode('usage')}
                    className={`text-left p-6 rounded-2xl border-2 transition-all group ${
                      mode === 'usage' 
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Languages className={`w-5 h-5 ${mode === 'usage' ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="font-bold">Modo 2: ¿Hiragana o Katakana?</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">Decide qué silabario utilizar basándote en el contexto de la palabra.</p>
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={practice}
                      onChange={e => setPractice(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                    />
                    <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Modo práctica (sin penalización)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={audio}
                      onChange={e => setAudio(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                    />
                    <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Audio TTS</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Tiempo por pregunta:</span>
                    <select 
                      value={timePerQuestion}
                      onChange={e => setTimePerQuestion(Number(e.target.value))}
                      className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value={8}>8s</option>
                      <option value={12}>12s</option>
                      <option value={20}>20s</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => startGame()}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Comenzar Partida
                  </button>
                  <button 
                    onClick={() => loadProgress()}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold active:scale-95 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Continuar guardada
                  </button>
                  <button 
                    onClick={clearSave}
                    className="px-6 py-3 bg-transparent hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl font-medium active:scale-95 transition-all text-sm"
                  >
                    Borrar progreso
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'game' && (
              <motion.div 
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6"
              >
                {renderStats()}

                <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-8 border border-slate-700/30">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(remaining / timePerQuestion) * 100}%` }}
                    className={`h-full transition-colors ${
                      remaining < 3 ? 'bg-red-500' : remaining < 6 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-inner">
                  <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold mb-4">
                    {mode === 'kana' ? '¿Cuál es el kana para?' : '¿Qué sistema se usa para?'}
                  </p>
                  
                  {mode === 'kana' ? (
                    <h3 className="text-6xl font-extrabold text-white mb-2">{questions[index].romaji}</h3>
                  ) : (
                    <div className="space-y-2">
                       <h3 className="text-5xl font-extrabold text-white mb-1">{questions[index].word}</h3>
                       <p className="text-indigo-400/80 italic text-sm">({questions[index].meaning})</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(mode === 'kana' ? questions[index].options : ['Hiragana', 'Katakana']).map((opt: string) => (
                    <button
                      key={opt}
                      disabled={locked}
                      onClick={() => checkAnswer(opt)}
                      className={`relative overflow-hidden group py-6 rounded-2xl text-2xl font-bold transition-all border-2 ${
                        locked 
                          ? (mode === 'kana' ? opt === questions[index].answer : (questions[index].type === 'hira' ? opt === 'Hiragana' : opt === 'Katakana'))
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : selectedOption === opt 
                              ? 'bg-red-500/10 border-red-500 text-red-400'
                              : 'bg-slate-900 border-slate-800 opacity-40'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800 active:scale-[0.98]'
                      }`}
                    >
                      {opt}
                      {!locked && (
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border flex items-center gap-3 ${
                        feedback.ok ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100' : 'bg-red-500/10 border-red-500/50 text-red-100'
                      }`}
                    >
                      <div className={`p-1.5 rounded-full ${feedback.ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {feedback.ok ? <Trophy className="w-3 h-3 text-white" /> : <Zap className="w-3 h-3 text-white" />}
                      </div>
                      <p className="text-sm font-medium">{feedback.msg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {locked && (
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={nextQuestion}
                      className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl flex items-center gap-2 hover:bg-slate-200 active:scale-95 transition-all"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {screen === 'end' && (
              <motion.div 
                key="end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-10"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full mb-4">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">¡Misión Cumplida!</h2>
                  <p className="text-slate-400">Has completado el entrenamiento intensivo de Kana.</p>
                </div>

                <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Puntos</p>
                    <p className="text-3xl font-extrabold text-white">{score}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Aciertos</p>
                    <p className="text-3xl font-extrabold text-white">{correct}/{questions.length}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Rango</p>
                    <p className="text-xs font-bold text-indigo-400 uppercase mt-2">
                       { (correct / questions.length) >= 0.9 ? 'Maestro' : (correct / questions.length) >= 0.5 ? 'Constructor' : 'Explorador'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={() => { setScreen('menu'); }}
                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    Jugar otra vez
                  </button>
                  <button 
                    onClick={() => {
                        const blob = new Blob([JSON.stringify({score, correct, questions: questions.length}, null, 2)], {type: 'application/json'});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'kana-cert.json';
                        a.click();
                    }}
                    className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold active:scale-95 transition-all"
                  >
                    Guardar Certificado
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Sistema Operativo: KANA-OS V2.1</span>
          </div>
          <p className="text-[10px] text-slate-600 italic">"La repetición es la madre de la maestría"</p>
        </div>
      </div>
    </div>
  );
};
