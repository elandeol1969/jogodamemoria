import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Trophy, RotateCcw, Play, Users, Sparkles } from "lucide-react";

const ANIMAL_IMAGES = [
  { id: 1, name: "Abelha", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/da6158f2d_Capturadetela2026-01-25033434.png" },
  { id: 2, name: "Papagaio", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/f45348a0b_Capturadetela2026-01-25033503.png" },
  { id: 3, name: "Cachorro", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/a9c2654e2_Capturadetela2026-01-25033534.png" },
  { id: 4, name: "Urso Panda", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/5d1edc6f1_Capturadetela2026-01-25033543.png" },
  { id: 5, name: "Pinguim", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/9845a6e60_Capturadetela2026-01-25033559.png" },
  { id: 6, name: "Cobra", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/38bbc01af_Capturadetela2026-01-25033612.png" },
  { id: 7, name: "Peixe", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/1d172918e_Capturadetela2026-01-25033623.png" },
  { id: 8, name: "Leão", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/7888183fe_Capturadetela2026-01-25033633.png" },
  { id: 9, name: "Galinha", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/b934a6fb5_Capturadetela2026-01-25033645.png" },
  { id: 10, name: "Girafa", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/1f60808bc_Capturadetela2026-01-25033655.png" },
  { id: 11, name: "Zebra", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/2467d426c_Capturadetela2026-01-25033705.png" },
  { id: 12, name: "Beija-flor", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b2e02de80a157a6ebea7a9/edf859c54_Capturadetela2026-01-25033718.png" },
];

export default function MemoryGame() {
  const [gameState, setGameState] = useState("mode"); // mode, setup, playing, finished
  const [playerMode, setPlayerMode] = useState(null); // 1 or 2
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [pairsCount, setPairsCount] = useState(6);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const selectedAnimals = shuffleArray(ANIMAL_IMAGES).slice(0, pairsCount);
    const gameCards = shuffleArray([
      ...selectedAnimals.map((animal) => ({ ...animal, uniqueId: `${animal.id}-a` })),
      ...selectedAnimals.map((animal) => ({ ...animal, uniqueId: `${animal.id}-b` })),
    ]);
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setWrongAttempts(0);
    setCorrectAttempts(0);
    setGameState("playing");
  };

  const handleCardClick = (uniqueId) => {
    if (isChecking) return;
    if (flippedCards.includes(uniqueId)) return;
    if (isCardMatched(uniqueId)) return;
    if (flippedCards.length >= 2) return;

    const newFlipped = [...flippedCards, uniqueId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [first, second] = newFlipped;
      const card1 = cards.find(c => c.uniqueId === first);
      const card2 = cards.find(c => c.uniqueId === second);

      setTimeout(() => {
        if (card1.id === card2.id) {
          // Match found
          setMatchedPairs(prev => [...prev, card1.id]);
          if (playerMode === 1) {
            setCorrectAttempts(prev => prev + 1);
          } else {
            setScores(prev => ({
              ...prev,
              [currentPlayer === 1 ? "player1" : "player2"]: prev[currentPlayer === 1 ? "player1" : "player2"] + 1
            }));
          }
          setFlippedCards([]);
        } else {
          // No match
          setFlippedCards([]);
          if (playerMode === 1) {
            setWrongAttempts(prev => prev + 1);
          } else {
            setCurrentPlayer(prev => prev === 1 ? 2 : 1);
          }
        }
        setIsChecking(false);
      }, 1200);
    }
  };

  useEffect(() => {
    if (gameState === "playing" && matchedPairs.length === pairsCount) {
      setGameState("finished");
    }
  }, [matchedPairs, pairsCount, gameState]);

  const getWinner = () => {
    if (scores.player1 > scores.player2) return player1Name;
    if (scores.player2 > scores.player1) return player2Name;
    return "Empate";
  };

  const resetGame = () => {
    setGameState("mode");
    setPlayerMode(null);
    setPlayer1Name("");
    setPlayer2Name("");
    setPairsCount(6);
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScores({ player1: 0, player2: 0 });
    setWrongAttempts(0);
    setCorrectAttempts(0);
  };

  const isCardMatched = (uniqueId) => {
    const cardId = cards.find(c => c.uniqueId === uniqueId)?.id;
    return matchedPairs.includes(cardId);
  };

  const isCardFlipped = (uniqueId) => {
    return flippedCards.includes(uniqueId) || isCardMatched(uniqueId);
  };

  // Mode Selection Screen
  if (gameState === "mode") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-white text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block mb-3"
              >
                <Sparkles className="w-12 h-12" />
              </motion.div>
              <h1 className="text-3xl font-bold">Jogo da Memória</h1>
              <p className="text-emerald-100 mt-2">Escolha o modo de jogo</p>
            </div>
            
            <CardContent className="p-8 space-y-4">
              <p className="text-center text-gray-600 mb-6">Quantos jogadores vão participar?</p>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => {
                    setPlayerMode(1);
                    setGameState("setup");
                  }}
                  className="w-full h-20 text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                >
                  <Users className="w-6 h-6 mr-3" />
                  1 Jogador
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => {
                    setPlayerMode(2);
                    setGameState("setup");
                  }}
                  className="w-full h-20 text-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg"
                >
                  <Users className="w-6 h-6 mr-3" />
                  2 Jogadores
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        </div>

        <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200 py-6 mt-4">
          <a href="https://www.rede-sol.com" target="_blank" rel="noopener noreferrer" className="block max-w-6xl mx-auto text-center px-4 hover:opacity-70 transition-opacity">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6975c3b1bfd66ae04e62b899/031f6f528_favicon.png"
              alt="RED-e Soluções"
              className="w-6 h-6 mx-auto mb-2"
            />
            <p className="text-gray-600 text-xs">© 2025 RED-e Soluções</p>
          </a>
        </footer>
      </div>
    );
  }

  // Setup Screen
  if (gameState === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className={`p-6 text-white text-center ${
              playerMode === 1 
                ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                : "bg-gradient-to-r from-emerald-500 to-cyan-500"
            }`}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block mb-3"
              >
                <Sparkles className="w-12 h-12" />
              </motion.div>
              <h1 className="text-3xl font-bold">Jogo da Memória</h1>
              <p className="text-white/90 mt-2">
                {playerMode === 1 ? "Modo: 1 Jogador" : "Modo: 2 Jogadores"}
              </p>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">
                    {playerMode === 1 ? "Jogador" : "Jogadores"}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="player1" className="text-sm text-gray-600">
                    {playerMode === 1 ? "Seu Nome" : "Jogador 1"}
                  </Label>
                  <Input
                    id="player1"
                    placeholder={playerMode === 1 ? "Digite seu nome" : "Nome do Jogador 1"}
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                
                {playerMode === 2 && (
                  <div className="space-y-2">
                    <Label htmlFor="player2" className="text-sm text-gray-600">Jogador 2</Label>
                    <Input
                      id="player2"
                      placeholder="Nome do Jogador 2"
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-gray-600">Quantidade de Pares</Label>
                  <span className="text-2xl font-bold text-emerald-600">{pairsCount}</span>
                </div>
                <Slider
                  value={[pairsCount]}
                  onValueChange={(value) => setPairsCount(value[0])}
                  min={6}
                  max={12}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>6 pares</span>
                  <span>12 pares</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setGameState("mode")}
                  variant="outline"
                  className="flex-1 h-14"
                >
                  Voltar
                </Button>
                <Button
                  onClick={initializeGame}
                  disabled={playerMode === 1 ? !player1Name.trim() : (!player1Name.trim() || !player2Name.trim())}
                  className={`flex-1 h-14 text-lg font-semibold shadow-lg ${
                    playerMode === 1
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                  }`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>

        <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200 py-6 mt-4">
          <a href="https://www.rede-sol.com" target="_blank" rel="noopener noreferrer" className="block max-w-6xl mx-auto text-center px-4 hover:opacity-70 transition-opacity">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6975c3b1bfd66ae04e62b899/031f6f528_favicon.png"
              alt="RED-e Soluções"
              className="w-6 h-6 mx-auto mb-2"
            />
            <p className="text-gray-600 text-xs">© 2025 RED-e Soluções</p>
          </a>
        </footer>
      </div>
    );
  }

  // Game Screen
  if (gameState === "playing" || gameState === "finished") {
    const gridCols = pairsCount <= 6 ? 4 : pairsCount <= 8 ? 4 : 6;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Scoreboard */}
          {playerMode === 1 ? (
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Jogador</p>
                    <p className="font-bold text-2xl text-purple-600">{player1Name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">Tentativas Corretas</p>
                    <p className="text-4xl font-bold text-green-600">{correctAttempts}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">Tentativas Erradas</p>
                    <p className="text-4xl font-bold text-red-600">{wrongAttempts}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              animate={{ scale: currentPlayer === 1 && gameState === "playing" ? 1.02 : 1 }}
              className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                currentPlayer === 1 && gameState === "playing"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white ring-4 ring-emerald-300"
                  : "bg-white/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentPlayer === 1 && gameState === "playing" ? "text-emerald-100" : "text-gray-500"}`}>
                    {currentPlayer === 1 && gameState === "playing" ? "🎯 Sua vez!" : "Jogador 1"}
                  </p>
                  <p className="font-bold text-lg truncate">{player1Name}</p>
                </div>
                <div className={`text-4xl font-bold ${currentPlayer === 1 && gameState === "playing" ? "text-white" : "text-emerald-600"}`}>
                  {scores.player1}
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: currentPlayer === 2 && gameState === "playing" ? 1.02 : 1 }}
              className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                currentPlayer === 2 && gameState === "playing"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white ring-4 ring-cyan-300"
                  : "bg-white/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentPlayer === 2 && gameState === "playing" ? "text-cyan-100" : "text-gray-500"}`}>
                    {currentPlayer === 2 && gameState === "playing" ? "🎯 Sua vez!" : "Jogador 2"}
                  </p>
                  <p className="font-bold text-lg truncate">{player2Name}</p>
                </div>
                <div className={`text-4xl font-bold ${currentPlayer === 2 && gameState === "playing" ? "text-white" : "text-cyan-600"}`}>
                  {scores.player2}
                </div>
              </div>
            </motion.div>
          </div>
          )}
          {/* End of conditional scoreboard */}

          {/* Game Board */}
          <div 
            className={`grid gap-3 md:gap-4 justify-center mx-auto`}
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              maxWidth: gridCols === 4 ? "500px" : "700px"
            }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.uniqueId}
                className="aspect-square cursor-pointer perspective-1000"
                onClick={() => handleCardClick(card.uniqueId)}
                whileHover={{ scale: isCardFlipped(card.uniqueId) ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="relative w-full h-full"
                  initial={false}
                  animate={{ rotateY: isCardFlipped(card.uniqueId) ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  {/* Card Back */}
                  <div 
                    className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center ${
                      isCardMatched(card.uniqueId) 
                        ? "bg-emerald-100" 
                        : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    }`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden"
                    }}
                  >
                    <div className="w-full h-full rounded-xl border-4 border-white/30 flex items-center justify-center">
                      <span className="text-4xl">🎴</span>
                    </div>
                  </div>
                  
                  {/* Card Front */}
                  <div 
                    className={`absolute inset-0 rounded-xl shadow-lg overflow-hidden ${
                      isCardMatched(card.uniqueId) 
                        ? "ring-4 ring-emerald-400 bg-emerald-50" 
                        : "bg-white"
                    }`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <img
                      src={card.url}
                      alt={card.name}
                      className="w-full h-full object-contain p-1"
                    />
                    {isCardMatched(card.uniqueId) && (
                      <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Pares encontrados: <span className="font-bold text-emerald-600">{matchedPairs.length}</span> de <span className="font-bold">{pairsCount}</span>
            </p>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-8 mt-8">
            <a href="https://www.rede-sol.com" target="_blank" rel="noopener noreferrer" className="block max-w-6xl mx-auto text-center px-4 hover:opacity-70 transition-opacity">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6975c3b1bfd66ae04e62b899/031f6f528_favicon.png"
                alt="RED-e Soluções"
                className="w-8 h-8 mx-auto mb-3"
              />
              <p className="text-gray-600 text-sm">© 2025 RED-e Soluções</p>
            </a>
          </footer>
        </div>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameState === "finished" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className={`p-8 text-center text-white ${
                  playerMode === 1
                    ? "bg-gradient-to-r from-purple-400 to-pink-500"
                    : "bg-gradient-to-r from-amber-400 to-orange-500"
                }`}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Trophy className="w-20 h-20 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-3xl font-bold">
                    {playerMode === 1 ? "Parabéns!" : "Fim de Jogo!"}
                  </h2>
                </div>
                
                <div className="p-8">
                  {playerMode === 1 ? (
                    <>
                      <div className="text-center mb-6">
                        <p className="text-gray-500 mb-2">Jogador</p>
                        <p className="text-3xl font-bold text-purple-600">🎮 {player1Name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <p className="text-sm text-gray-500">Acertos</p>
                          <p className="text-3xl font-bold text-green-600">{correctAttempts}</p>
                          <p className="text-xs text-gray-400">tentativas</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                          <p className="text-sm text-gray-500">Erros</p>
                          <p className="text-3xl font-bold text-red-600">{wrongAttempts}</p>
                          <p className="text-xs text-gray-400">tentativas</p>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4 text-center mb-8">
                        <p className="text-sm text-gray-500">Total de Tentativas</p>
                        <p className="text-4xl font-bold text-purple-600">{correctAttempts + wrongAttempts}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        {getWinner() === "Empate" ? (
                          <p className="text-2xl font-bold text-gray-700">🤝 Empate!</p>
                        ) : (
                          <>
                            <p className="text-gray-500 mb-2">Vencedor</p>
                            <p className="text-3xl font-bold text-emerald-600">🏆 {getWinner()}</p>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-emerald-50 rounded-xl p-4 text-center">
                          <p className="text-sm text-gray-500">{player1Name}</p>
                          <p className="text-3xl font-bold text-emerald-600">{scores.player1}</p>
                          <p className="text-xs text-gray-400">pontos</p>
                        </div>
                        <div className="bg-cyan-50 rounded-xl p-4 text-center">
                          <p className="text-sm text-gray-500">{player2Name}</p>
                          <p className="text-3xl font-bold text-cyan-600">{scores.player2}</p>
                          <p className="text-xs text-gray-400">pontos</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={initializeGame}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Jogar Novamente
                    </Button>
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="w-full h-12"
                    >
                      Nova Configuração
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}