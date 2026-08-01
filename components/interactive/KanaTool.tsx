'use client';
import React, { useState } from "react";
import { motion as framerMotion } from "motion/react";
import { Languages } from "lucide-react";

// Types for components if needed, though they are inside for simplicity
const MotionDiv = framerMotion.div;

export const KanaTool = () => {
  const [activeGame, setActiveGame] = useState<"study" | "puzzle" | "sorter" | "phonetic">("study");
  const [view, setView] = useState<"hiragana" | "katakana">("hiragana");
  
  const hiragana = [
    { k: "あ", r: "a" }, { k: "い", r: "i" }, { k: "う", r: "u" }, { k: "え", r: "e" }, { k: "お", r: "o" },
    { k: "か", r: "ka" }, { k: "き", r: "ki" }, { k: "く", r: "ku" }, { k: "け", r: "ke" }, { k: "こ", r: "ko" },
    { k: "さ", r: "sa" }, { k: "し", r: "shi" }, { k: "す", r: "su" }, { k: "せ", r: "se" }, { k: "そ", r: "so" },
    { k: "た", r: "ta" }, { k: "ち", r: "chi" }, { k: "つ", r: "tsu" }, { k: "て", r: "te" }, { k: "と", r: "to" },
    { k: "な", r: "na" }, { k: "に", r: "ni" }, { k: "ぬ", r: "nu" }, { k: "ね", r: "ne" }, { k: "の", r: "no" },
    { k: "は", r: "ha" }, { k: "ひ", r: "hi" }, { k: "ふ", r: "fu" }, { k: "へ", r: "he" }, { k: "ほ", r: "ho" },
    { k: "ま", r: "ma" }, { k: "み", r: "mi" }, { k: "む", r: "mu" }, { k: "め", r: "me" }, { k: "も", r: "mo" },
    { k: "や", r: "ya" }, { k: "ゆ", r: "yu" }, { k: "よ", r: "yo" },
    { k: "ら", r: "ra" }, { k: "り", r: "ri" }, { k: "る", r: "ru" }, { k: "れ", r: "re" }, { k: "ろ", r: "ro" },
    { k: "わ", r: "wa" }, { k: "を", r: "wo" }, { k: "ん", r: "n" },
    { k: "が", r: "ga" }, { k: "ぎ", r: "gi" }, { k: "ぐ", r: "gu" }, { k: "げ", r: "ge" }, { k: "ご", r: "go" },
    { k: "ざ", r: "za" }, { k: "じ", r: "ji" }, { k: "ず", r: "zu" }, { k: "ぜ", r: "ze" }, { k: "ぞ", r: "zo" },
    { k: "だ", r: "da" }, { k: "ぢ", r: "ji" }, { k: "づ", r: "zu" }, { k: "で", r: "de" }, { k: "ど", r: "do" },
    { k: "ば", r: "ba" }, { k: "ビ", r: "bi" }, { k: "ぶ", r: "bu" }, { k: "べ", r: "be" }, { k: "ぼ", r: "bo" },
    { k: "ぱ", r: "pa" }, { k: "ぴ", r: "pi" }, { k: "ぷ", r: "pu" }, { k: "ぺ", r: "pe" }, { k: "ぽ", r: "po" },
  ];

  const katakana = [
    { k: "ア", r: "a" }, { k: "イ", r: "i" }, { k: "ウ", r: "u" }, { k: "エ", r: "e" }, { k: "オ", r: "o" },
    { k: "カ", r: "ka" }, { k: "キ", r: "ki" }, { k: "ク", r: "ku" }, { k: "ケ", r: "ke" }, { k: "コ", r: "ko" },
    { k: "サ", r: "sa" }, { k: "シ", r: "shi" }, { k: "ス", r: "su" }, { k: "セ", r: "se" }, { k: "ソ", r: "so" },
    { k: "タ", r: "ta" }, { k: "チ", r: "chi" }, { k: "ツ", r: "tsu" }, { k: "テ", r: "te" }, { k: "ト", r: "to" },
    { k: "ナ", r: "na" }, { k: "ニ", r: "ni" }, { k: "ヌ", r: "nu" }, { k: "ネ", r: "ne" }, { k: "ノ", r: "no" },
    { k: "ハ", r: "ha" }, { k: "ヒ", r: "hi" }, { k: "フ", r: "fu" }, { k: "ヘ", r: "he" }, { k: "ホ", r: "ho" },
    { k: "マ", r: "ma" }, { k: "ミ", r: "mi" }, { k: "ム", r: "mu" }, { k: "メ", r: "me" }, { k: "モ", r: "mo" },
    { k: "ヤ", r: "ya" }, { k: "ユ", r: "yu" }, { k: "ヨ", r: "yo" },
    { k: "ラ", r: "ra" }, { k: "リ", r: "ri" }, { k: "ル", r: "ru" }, { k: "レ", r: "re" }, { k: "ロ", r: "ro" },
    { k: "ワ", r: "wa" }, { k: "ヲ", r: "wo" }, { k: "ン", r: "n" },
    { k: "ガ", r: "ga" }, { k: "ギ", r: "gi" }, { k: "グ", r: "gu" }, { k: "ゲ", r: "ge" }, { k: "ゴ", r: "go" },
    { k: "ザ", r: "za" }, { k: "ジ", r: "ji" }, { k: "ズ", r: "zu" }, { k: "ゼ", r: "ze" }, { k: "ゾ", r: "zo" },
    { k: "ダ", r: "da" }, { k: "ヂ", r: "ji" }, { k: "ヅ", r: "zu" }, { k: "デ", r: "de" }, { k: "ド", r: "do" },
    { k: "バ", r: "ba" }, { k: "ビ", r: "bi" }, { k: "ブ", r: "bu" }, { k: "ベ", r: "be" }, { k: "ボ", r: "bo" },
    { k: "パ", r: "pa" }, { k: "ピ", r: "pi" }, { k: "プ", r: "pu" }, { k: "ペ", r: "pe" }, { k: "ポ", r: "po" },
  ];

  const sortingWords = [
    { w: "Sakura (flor cerezo)", type: "hiragana" },
    { w: "Konpyuuta", type: "katakana" },
    { w: "Neko (gato)", type: "hiragana" },
    { w: "Piza", type: "katakana" },
    { w: "Arigatou", type: "hiragana" },
    { w: "Amerika", type: "katakana" },
    { w: "Sushi", type: "hiragana" },
    { w: "Aisukurimu", type: "katakana" },
  ];

  const [gameState, setGameState] = useState<any>({
    target: null,
    options: [],
    feedback: null,
    score: 0,
    total: 0,
    history: []
  });

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const startPuzzle = () => {
    const targetIdx = Math.floor(Math.random() * hiragana.length);
    const targetH = hiragana[targetIdx];
    const targetK = katakana[targetIdx];
    
    // Distractors
    const others = hiragana
      .filter((_, i) => i !== targetIdx)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(i => i.k);
    
    setGameState((prev: any) => ({
      ...prev,
      target: targetH.r,
      options: [targetH.k, targetK.k, ...others].sort(() => 0.5 - Math.random()),
      feedback: null,
      correctAnswers: [targetH.k, targetK.k]
    }));
    setActiveGame("puzzle");
  };

  const startSorter = () => {
    const target = sortingWords[Math.floor(Math.random() * sortingWords.length)];
    setGameState((prev: any) => ({
      ...prev,
      target: target.w,
      correctType: target.type,
      feedback: null
    }));
    setActiveGame("sorter");
  };

  const startPhonetic = () => {
    const pairs = [
      { k: "し", r: "shi", distractors: ["chi", "su", "hi"] },
      { k: "つ", r: "tsu", distractors: ["su", "chi", "nu"] },
      { k: "ん", r: "n", distractors: ["no", "mu", "ne"] },
      { k: "り", r: "ri", distractors: ["di", "li", "i"] },
      { k: "ち", r: "chi", distractors: ["shi", "ti", "ki"] }
    ];
    const target = pairs[Math.floor(Math.random() * pairs.length)];
    setGameState((prev: any) => ({
      ...prev,
      target: target.k,
      options: [target.r, ...target.distractors].sort(() => 0.5 - Math.random()),
      correct: target.r,
      feedback: null
    }));
    setActiveGame("phonetic");
    setTimeout(() => speak(target.k), 500);
  };

  const checkSolution = (val: string) => {
    if (gameState.feedback) return;
    
    let isCorrect = false;
    if (activeGame === "puzzle") {
      isCorrect = gameState.correctAnswers.includes(val);
    } else if (activeGame === "sorter") {
      isCorrect = val === gameState.correctType;
    } else if (activeGame === "phonetic") {
      isCorrect = val === gameState.correct;
    }

    setGameState((prev: any) => ({
      ...prev,
      feedback: isCorrect ? "correct" : "wrong",
      score: isCorrect ? prev.score + 1 : prev.score,
      total: prev.total + 1
    }));

    if (isCorrect && activeGame !== "sorter") {
      speak(activeGame === "phonetic" ? gameState.target : val);
    }

    setTimeout(() => {
      if (activeGame === "puzzle") startPuzzle();
      else if (activeGame === "sorter") startSorter();
      else if (activeGame === "phonetic") startPhonetic();
    }, 1500);
  };

  return (
    <div className="my-16 p-12 border border-brand-border bg-white shadow-sm no-print">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-brand-ink text-brand-offwhite">
            <Languages className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-serif text-2xl m-0!">Instituto de Lenguas</h4>
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand-muted font-bold mt-1">Exégesis del Kana</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center bg-brand-offwhite border border-brand-border p-1 gap-1">
          {[
            { id: "study", label: "CATÁLOGO" },
            { id: "puzzle", label: "RECONOCIMIENTO" },
            { id: "sorter", label: "SISTEMAS" },
            { id: "phonetic", label: "FONOLOGÍA" }
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => {
                if (g.id === "study") setActiveGame("study");
                else if (g.id === "puzzle") startPuzzle();
                else if (g.id === "sorter") startSorter();
                else if (g.id === "phonetic") startPhonetic();
              }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeGame === g.id ? "bg-brand-ink text-brand-offwhite" : "text-brand-muted hover:text-brand-ink"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {activeGame !== "study" && (
        <div className="flex justify-center gap-12 mb-12">
           <div className="text-center">
              <p className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Aciertos</p>
              <p className="text-3xl font-serif text-brand-blue">{gameState.score}</p>
           </div>
           <div className="h-12 w-[1px] bg-brand-border" />
           <div className="text-center">
              <p className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Sesiones</p>
              <p className="text-3xl font-serif text-brand-ink">{gameState.total}</p>
           </div>
        </div>
      )}

      <div className="min-h-[400px] flex items-center justify-center">
        {activeGame === "study" && (
          <div className="w-full">
            <div className="mb-12 flex justify-center gap-4">
              {(["hiragana", "katakana"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setView(t)}
                  className={`px-8 py-2 text-[10px] font-bold uppercase tracking-[0.3em] border transition-all ${
                    view === t 
                      ? "bg-brand-ink text-brand-offwhite border-brand-ink" 
                      : "bg-transparent text-brand-muted border-brand-border hover:border-brand-ink hover:text-brand-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-px bg-brand-border border border-brand-border">
              {(view === "hiragana" ? hiragana : katakana).map((item, i) => (
                <MotionDiv
                  key={`${view}-${item.k}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  onClick={() => speak(item.k)}
                  className="flex flex-col items-center justify-center p-6 bg-white hover:bg-brand-blue hover:text-white transition-all aspect-square group cursor-pointer"
                >
                  <span className="text-3xl font-serif mb-2 group-hover:scale-110 transition-transform">{item.k}</span>
                  <span className="text-[10px] uppercase tracking-tighter text-brand-muted group-hover:text-white/60 font-bold">{item.r}</span>
                </MotionDiv>
              ))}
            </div>
          </div>
        )}

        {activeGame === "puzzle" && (
          <div className="flex flex-col items-center w-full">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-muted mb-8">Identificación de Grafema</p>
            <div className="bg-brand-offwhite px-16 py-12 border border-brand-border mb-12">
              <span className="text-6xl font-serif text-brand-ink">{gameState.target?.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {gameState.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => checkSolution(opt)}
                  className={`py-8 text-4xl font-serif transition-colors border shadow-sm ${
                    gameState.feedback === "correct" && gameState.correctAnswers.includes(opt)
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-brand-border hover:border-brand-ink"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGame === "sorter" && (
          <div className="flex flex-col items-center w-full">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-muted mb-8">Categorización Etimológica</p>
            <MotionDiv 
              key={gameState.target}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-ink text-brand-offwhite px-12 py-6 text-3xl font-serif mb-16 shadow-2xl"
            >
              {gameState.target}
            </MotionDiv>
            <div className="flex gap-6 w-full max-w-md">
              {["hiragana", "katakana"].map(type => (
                <button
                  key={type}
                  onClick={() => checkSolution(type)}
                  className={`flex-1 py-5 font-bold uppercase text-[10px] tracking-[0.4em] transition-all border ${
                    gameState.feedback && type === gameState.correctType
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-brand-border hover:bg-brand-ink hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeGame === "phonetic" && (
          <div className="flex flex-col items-center w-full">
            <button 
              onClick={() => speak(gameState.target)}
              className="w-28 h-28 bg-brand-ink text-brand-offwhite flex items-center justify-center mb-16 hover:bg-brand-blue transition-all shadow-2xl group"
            >
              <Languages className="h-10 w-10 group-hover:scale-110 transition-transform" />
            </button>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {gameState.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => checkSolution(opt)}
                  className={`py-6 font-bold uppercase text-[11px] tracking-[0.3em] transition-all border ${
                    gameState.feedback === "correct" && opt === gameState.correct
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-brand-border hover:border-brand-ink hover:text-brand-ink font-bold"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-brand-border text-center">
        <p className="text-[11px] text-brand-muted italic max-w-md mx-auto leading-relaxed">
          {activeGame === "study" && "Modo Estudio: Toca cualquier carácter para escuchar su sonido real."}
          {activeGame === "puzzle" && "Puzzle: Encuentra el símbolo (Hiragana o Katakana) que corresponde al Romaji."}
          {activeGame === "sorter" && "Clasificación: ¿Palabra japonesa (Hiragana) o préstamo extranjero (Katakana)?"}
          {activeGame === "phonetic" && "Fonética: Escucha con atención y elige la transcripción correcta."}
        </p>
      </div>
    </div>
  );
};
