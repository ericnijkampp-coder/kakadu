import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { GameCard } from './GameCard';
import { Coins, LogOut, User } from 'lucide-react';

const games = [
  {
    id: 'slots',
    name: 'Slot Machine',
    description: 'Spin the reels and win big!',
    minBet: 10,
    maxBet: 500,
    image: '🎰'
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    description: 'Beat the dealer with 21!',
    minBet: 25,
    maxBet: 1000,
    image: '🃏'
  },
  {
    id: 'roulette',
    name: 'Roulette',
    description: 'Place your bets on red or black!',
    minBet: 5,
    maxBet: 2000,
    image: '🎡'
  },
  {
    id: 'poker',
    name: 'Five Card Draw',
    description: 'Get the best poker hand!',
    minBet: 50,
    maxBet: 2000,
    image: '🃏'
  },
  {
    id: 'dice',
    name: 'Dice Game',
    description: 'Roll the dice and win!',
    minBet: 20,
    maxBet: 1000,
    image: '🎲'
  },
  {
    id: 'wheel',
    name: 'Wheel of Fortune',
    description: 'Spin for massive multipliers!',
    minBet: 30,
    maxBet: 1500,
    image: '🎡'
  }
];

export const CasinoDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-yellow-400">🎰 Kansimo Casino</h1>
            <Badge className="bg-green-600 text-white animate-pulse">6 Games Available!</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-yellow-600/20 px-4 py-2 rounded-lg">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{user?.balance?.toLocaleString()} coins</span>
            </div>
            
            <a 
              href="https://payment-links.mollie.com/payment/poypJR9ucYYgGd93hoJ3c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white animate-pulse">
                💳 Deposit
              </Button>
            </a>
            
            <div className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5" />
              <span>{user?.email}</span>
            </div>
            
            <Button variant="outline" onClick={logout} className="text-white border-white hover:bg-white hover:text-black">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome to the Premium Casino Floor! 🎊</h2>
          <p className="text-xl text-gray-300">6 Exciting Games - Choose your adventure and win big!</p>
        </div>

        {/* Deposit Promotion */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-emerald-600 border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">💰 Need More Coins?</CardTitle>
            <CardDescription className="text-green-100">
              Deposit now and get bonus coins to play with! More games = More winning opportunities!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="https://payment-links.mollie.com/payment/poypJR9ucYYgGd93hoJ3c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Deposit Now - Get Bonus Coins!
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* New Games Highlight */}
        <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">🆕 New Games Added!</CardTitle>
            <CardDescription className="text-purple-100">
              Try our exciting new games: Five Card Draw Poker, Dice Game, and Wheel of Fortune!
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-black/40 border-yellow-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-400">Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user?.balance?.toLocaleString()} coins</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-yellow-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-400">Games Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{games.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-yellow-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-400">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-600 text-white">Online</Badge>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-400">Max Jackpot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">50x Multiplier!</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};