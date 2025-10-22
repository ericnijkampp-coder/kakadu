import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PlayingCard {
  suit: string;
  value: string;
  numValue: number;
}

const suits = ['♠️', '♥️', '♦️', '♣️'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const Blackjack: React.FC = () => {
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [playerCards, setPlayerCards] = useState<PlayingCard[]>([]);
  const [dealerCards, setDealerCards] = useState<PlayingCard[]>([]);
  const [bet, setBet] = useState(25);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [showDealerCard, setShowDealerCard] = useState(false);
  const { user, updateBalance } = useAuth();

  const createDeck = (): PlayingCard[] => {
    const newDeck: PlayingCard[] = [];
    suits.forEach(suit => {
      values.forEach(value => {
        let numValue = parseInt(value);
        if (value === 'A') numValue = 11;
        else if (['J', 'Q', 'K'].includes(value)) numValue = 10;
        
        newDeck.push({ suit, value, numValue });
      });
    });
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const calculateScore = (cards: PlayingCard[]): number => {
    let score = cards.reduce((sum, card) => sum + card.numValue, 0);
    let aces = cards.filter(card => card.value === 'A').length;
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const dealCard = (currentDeck: PlayingCard[]): [PlayingCard, PlayingCard[]] => {
    const card = currentDeck[0];
    const newDeck = currentDeck.slice(1);
    return [card, newDeck];
  };

  const startGame = () => {
    if (!user || user.balance < bet) {
      toast.error('Insufficient balance!');
      return;
    }

    updateBalance(-bet);
    const newDeck = createDeck();
    
    const [playerCard1, deck1] = dealCard(newDeck);
    const [dealerCard1, deck2] = dealCard(deck1);
    const [playerCard2, deck3] = dealCard(deck2);
    const [dealerCard2, finalDeck] = dealCard(deck3);

    setDeck(finalDeck);
    setPlayerCards([playerCard1, playerCard2]);
    setDealerCards([dealerCard1, dealerCard2]);
    setGameState('playing');
    setShowDealerCard(false);
  };

  const hit = () => {
    const [newCard, newDeck] = dealCard(deck);
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    setDeck(newDeck);

    if (calculateScore(newPlayerCards) > 21) {
      setGameState('finished');
      toast.error('Bust! You lose!');
    }
  };

  const stand = () => {
    setGameState('dealer');
    setShowDealerCard(true);
    
    const currentDealerCards = [...dealerCards];
    let currentDeck = [...deck];
    
    while (calculateScore(currentDealerCards) < 17) {
      const [newCard, newDeck] = dealCard(currentDeck);
      currentDealerCards.push(newCard);
      currentDeck = newDeck;
    }
    
    setDealerCards(currentDealerCards);
    setDeck(currentDeck);
    
    setTimeout(() => {
      const playerScore = calculateScore(playerCards);
      const dealerScore = calculateScore(currentDealerCards);
      
      if (dealerScore > 21) {
        updateBalance(bet * 2);
        toast.success('Dealer busts! You win!');
      } else if (playerScore > dealerScore) {
        updateBalance(bet * 2);
        toast.success('You win!');
      } else if (playerScore === dealerScore) {
        updateBalance(bet);
        toast.success('Push! Bet returned.');
      } else {
        toast.error('Dealer wins!');
      }
      
      setGameState('finished');
    }, 1000);
  };

  const newGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGameState('betting');
    setShowDealerCard(false);
  };

  const renderCard = (card: PlayingCard, hidden = false) => (
    <div className="w-16 h-24 bg-white rounded-lg flex flex-col items-center justify-center text-black border-2 border-gray-300">
      {hidden ? (
        <div className="text-2xl">🂠</div>
      ) : (
        <>
          <div className="text-xs">{card.value}</div>
          <div className="text-lg">{card.suit}</div>
        </>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-green-900 to-emerald-900 text-white border-yellow-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-yellow-400">🃏 Blackjack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game Area */}
        <div className="bg-black/50 p-6 rounded-lg space-y-6">
          {/* Dealer's Hand */}
          <div className="text-center">
            <h3 className="text-xl mb-2">Dealer's Hand {showDealerCard && `(${calculateScore(dealerCards)})`}</h3>
            <div className="flex justify-center space-x-2">
              {dealerCards.map((card, index) => (
                <div key={index}>
                  {renderCard(card, index === 1 && !showDealerCard)}
                </div>
              ))}
            </div>
          </div>

          {/* Player's Hand */}
          <div className="text-center">
            <h3 className="text-xl mb-2">Your Hand {playerCards.length > 0 && `(${calculateScore(playerCards)})`}</h3>
            <div className="flex justify-center space-x-2">
              {playerCards.map((card, index) => (
                <div key={index}>
                  {renderCard(card)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg">Your Balance:</span>
            <span className="text-xl font-bold text-yellow-400">{user?.balance} coins</span>
          </div>

          {gameState === 'betting' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-lg">Bet Amount:</label>
                <Input
                  type="number"
                  value={bet}
                  onChange={(e) => setBet(Math.max(25, parseInt(e.target.value) || 25))}
                  min="25"
                  max={user?.balance || 0}
                  className="w-32 bg-black/50 border-yellow-500 text-white"
                />
                <span className="text-sm text-gray-300">coins</span>
              </div>
              
              <Button
                onClick={startGame}
                disabled={!user || user.balance < bet}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-xl py-6"
              >
                Deal Cards ({bet} coins)
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="flex space-x-4">
              <Button
                onClick={hit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4"
              >
                Hit
              </Button>
              <Button
                onClick={stand}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4"
              >
                Stand
              </Button>
            </div>
          )}

          {gameState === 'finished' && (
            <Button
              onClick={newGame}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-xl py-6"
            >
              New Game
            </Button>
          )}
        </div>

        {/* Rules */}
        <div className="bg-black/30 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-yellow-400">Rules:</h3>
          <div className="text-sm space-y-1">
            <div>• Get as close to 21 as possible without going over</div>
            <div>• Face cards are worth 10, Aces are 11 or 1</div>
            <div>• Dealer must hit on 16 and stand on 17</div>
            <div>• Blackjack pays 2:1</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};