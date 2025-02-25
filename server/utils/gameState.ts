import { GeoPoint } from '~~/types/geo';

export type Guess = {
  playerId: string;
  position: {
    lat: number;
    lng: number;
  };
};

export type Player = {
  id: string;
  username: string;
};

export type Game = {
  id: string;
  status: 'waiting' | 'active' | 'finished';
  players: Player[];
  guesses: {
    [round: number]: Guess[];
  };
  locations: string[];
  currentRound: number;
  realPositions: {
    [round: number]: {
      lat: number;
      lng: number;
    };
  };
};

// La map des jeux
const games = new Map<string, Game>();

export const gameState = {
  /**
   * Récupère un jeu par son ID
   */
  getGame(gameId: string): Game | undefined {
    return games.get(gameId);
  },

  /**
   * Récupère tous les jeux
   */
  getAllGames(): Map<string, Game> {
    return games;
  },

  /**
   * Ajoute ou met à jour un jeu
   */
  setGame(gameId: string, game: Game): void {
    games.set(gameId, game);
  },

  /**
   * Supprime un jeu
   */
  removeGame(gameId: string): boolean {
    return games.delete(gameId);
  },

  /**
   * Calcule les scores pour un jeu
   */
  calculateScores(gameId: string, haversineDistance: (p1: GeoPoint, p2: GeoPoint) => number): Array<{position: number, player: string, score: number}> {
    const game = games.get(gameId);
    if (!game) {
      return [];
    }

    // D'abord, calculer les distances totales par joueur
    const rawScores = Object.entries(game.guesses).reduce((acc, [round, roundGuesses]) => {
      roundGuesses.forEach(guess => {
        const player = game.players.find(p => p.id === guess.playerId);
        if (player && game.realPositions[parseInt(round)]) {
          const distance = haversineDistance(
            {
              lat: guess.position.latitude || guess.position.lat,
              lng: guess.position.longitude || guess.position.lng
            },
            game.realPositions[parseInt(round)]
          );
          acc[player.username] = (acc[player.username] || 0) + distance;
        }
      });
      return acc;
    }, {} as { [key: string]: number });

    // Convertir en tableau avec position
    const scoreArray = Object.entries(rawScores)
      .map(([player, score]) => ({
        player,
        score,
        position: 0 // Sera défini après le tri
      }))
      .sort((a, b) => a.score - b.score); // Trier par score croissant (meilleur score = distance la plus courte)

    // Attribuer les positions
    scoreArray.forEach((item, index) => {
      item.position = index + 1;
    });

    return scoreArray;
  }
};