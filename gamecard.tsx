import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlotMachine } from '@/components/games/SlotMachine';
import { Blackjack } from '@/components/games/Blackjack';
import { Roulette } from '@/components/games/Roulette';
import { Poker } from '@/components/games/Poker';
import { Dice } from '@/components/games/Dice';
import { WheelOfFortune } from '@/components/games/WheelOfFortune';

interface Game {
  id: string;
  name: string;
  description: string;
  minBet: number;
  maxBet: number;
  image: string;
}

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayGame = () => {
    setIsPlaying(true);
  };

  const handleBackToLobby = () => {
    setIsPlaying(false);
  };

  const getGameSpecialBadge = (gameId: string) => {
    switch (gameId) {
      case 'poker':
        return <Badge className="bg-purple-600 text-white text-xs">NEW!</Badge>;
      case 'dice':
        return <Badge className="bg-orange-600 text-white text-xs">NEW!</Badge>;
      case 'wheel':
        return <Badge className="bg-pink-600 text-white text-xs">HOT!</Badge>;
      case 'slots':
        return <Badge className="bg-blue-600 text-white text-xs">CLASSIC</Badge>;
      default:
        return null;
    }
  };

  if (isPlaying) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="mb-4">
            <Button onClick={handleBackToLobby} variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              ← Back to Lobby
            </Button>
          </div>
          {game.id === 'slots' && <SlotMachine />}
          {game.id === 'blackjack' && <Blackjack />}
          {game.id === 'roulette' && <Roulette />}
          {game.id === 'poker' && <Poker />}
          {game.id === 'dice' && <Dice />}
          {game.id === 'wheel' && <WheelOfFortune />}
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-black/40 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden">
      {/* Special Badge */}
      <div className="absolute top-2 right-2 z-10">
        {getGameSpecialBadge(game.id)}
      </div>

      <CardHeader className="text-center">
        <div className="text-6xl mb-4">{game.image}</div>
        <CardTitle className="text-xl text-yellow-400">{game.name}</CardTitle>
        <CardDescription className="text-gray-300">{game.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Min Bet:</span>
          <Badge variant="outline" className="text-green-400 border-green-400">
            {game.minBet} coins
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Max Bet:</span>
          <Badge variant="outline" className="text-red-400 border-red-400">
            {game.maxBet} coins
          </Badge>
        </div>
        
        {/* Special Features */}
        {game.id === 'wheel' && (
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              Up to 50x Multiplier!
            </Badge>
          </div>
        )}
        
        {game.id === 'poker' && (
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
              Strategy Game
            </Badge>
          </div>
        )}
        
        {game.id === 'dice' && (
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
              Multiple Bet Types
            </Badge>
          </div>
        )}

        <Button 
          onClick={handlePlayGame}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
        >
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
};