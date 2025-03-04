import {Peer} from "crossws";
import {haversineDistance} from "~~/server/api/end-game.post";
import {gameState, Game, Guess} from "~~/server/utils/gameState";
import { getPanoramaxPictureIDs } from "~/utils/panoramax";

function createGameId(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function createPlayerId(): string {
    return Math.random().toString(36).substring(2, 10);
}

async function handleCreateGame(peer: Peer, username: string) {
    const gameId = createGameId();
    const playerId = createPlayerId();
    const player = { id: playerId, username };

    try {
        const pictures = (await getPanoramaxPictureIDs(5));
        const game: Game = {
            id: gameId,
            status: 'waiting',
            players: [player],
            locations: pictures.map(p => p.id),
            currentRound: 0,
            guesses: {},
            realPositions: pictures.map(p => p.position)
        };

        gameState.setGame(gameId, game);
        peer.subscribe(`game:${gameId}`);

        peer.send(JSON.stringify({
            action: 'gameCreated',
            gameId,
            playerId,
            players: game.players
        }));
    } catch (error) {
        peer.send(JSON.stringify({
            action: 'error',
            message: 'Failed to create game'
        }));
    }
}

function handleJoinGame(peer: Peer, gameId: string, username: string) {
    const game = gameState.getGame(gameId);

    if (!game || game.status !== 'waiting') {
        peer.send(JSON.stringify({
            action: 'error',
            message: 'Game not found or already started'
        }));
        return;
    }

    const playerId = createPlayerId();
    const player = { id: playerId, username };
    game.players.push(player);

    peer.send(JSON.stringify({
        action: 'joined',
        gameId,
        playerId,
        players: game.players
    }));

    peer.subscribe(`game:${gameId}`);
    peer.publish(`game:${gameId}`, JSON.stringify({
        action: 'playerListUpdated',
        players: game.players
    }));

    gameState.setGame(gameId, game);
}

function handleStartGame(peer: Peer, gameId: string) {
    const game = gameState.getGame(gameId);
    if (!game || game.status !== 'waiting') return;

    game.status = 'active';
    gameState.setGame(gameId, game);

    peer.send(JSON.stringify({
        action: 'gameStarted',
        locationId: game.locations[0]
    }));

    peer.publish(`game:${gameId}`, JSON.stringify({
        action: 'gameStarted',
        locationId: game.locations[0]
    }));
}

async function handleGuess(peer: Peer, gameId: string, playerId: string, guessPosition: { lat: number; lng: number }) {
    const game = gameState.getGame(gameId);
    if (!game || game.status !== 'active') return;

    if (!game.guesses[game.currentRound]) {
        game.guesses[game.currentRound] = [];
    }

    const existingGuessIndex = game.guesses[game.currentRound].findIndex(g => g.playerId === playerId);
    if (existingGuessIndex !== -1) {
        return;
    }

    const guess: Guess = {
        playerId,
        position: guessPosition
    };

    game.guesses[game.currentRound].push(guess);

    peer.publish(`game:${gameId}`, JSON.stringify({
        action: 'newGuess',
        playerId,
        guess
    }));

    const allPlayersGuessed = game.players.length === game.guesses[game.currentRound].length;

    if (allPlayersGuessed) {
        try {
            const nextLocation = game.locations[game.currentRound + 1];

            peer.send(JSON.stringify({
                action: 'roundComplete',
                guesses: game.guesses[game.currentRound],
                realPosition: game.realPositions[game.currentRound]
            }));

            peer.publish(`game:${gameId}`, JSON.stringify({
                action: 'roundComplete',
                guesses: game.guesses[game.currentRound],
                realPosition: game.realPositions[game.currentRound]
            }));

            game.currentRound++;

            setTimeout(() => {
                peer.send(JSON.stringify({
                    action: 'nextLocation',
                    locationId: nextLocation
                }));

                peer.publish(`game:${gameId}`, JSON.stringify({
                    action: 'nextLocation',
                    locationId: nextLocation
                }));
            }, 7000);
        } catch (error) {
            console.error('Error handling round completion:', error);
            peer.publish(`game:${gameId}`, JSON.stringify({
                action: 'error',
                message: 'Failed to proceed to next round'
            }));
        }
    }

    gameState.setGame(gameId, game);
}

function handleDisconnect(peer: Peer) {
    const games = gameState.getAllGames();
    games.forEach((game, gameId) => {
        game.players = game.players.filter(player =>
          peer.id !== `game:${gameId}:${player.id}`
        );
        gameState.setGame(gameId, game);
        peer.publish(`game:${gameId}`, JSON.stringify({
            action: 'playerListUpdated',
            players: game.players
        }));
    });
}

export default defineWebSocketHandler({
    message(peer, message) {
        try {
            const data: any = message.json();

            switch (data.action) {
                case 'create':
                    handleCreateGame(peer, data.username);
                    break;
                case 'join':
                    handleJoinGame(peer, data.gameId, data.username);
                    break;
                case 'start':
                    handleStartGame(peer, data.gameId);
                    break;
                case 'guess':
                    handleGuess(peer, data.gameId, data.playerId, data.guess);
                    break;
                case 'getScores':
                    const game = gameState.getGame(data.gameId);
                    if (game) {
                        const scores = gameState.calculateScores(data.gameId, haversineDistance);
                        peer.send(JSON.stringify({
                            action: 'scores',
                            scores
                        }));
                    } else {
                        peer.send(JSON.stringify({
                            action: 'error',
                            message: 'Game not found'
                        }));
                    }
                    break;
                case 'ping':
                    peer.send(JSON.stringify({ action: 'pong' }));
                    break;
                default:
                    peer.send(JSON.stringify({
                        action: 'error',
                        message: 'Invalid action'
                    }));
            }
        } catch (error) {
            console.error('Message handler error:', error);
            peer.send(JSON.stringify({
                action: 'error',
                message: 'Invalid message format'
            }));
        }
    },
    close(peer) {
        handleDisconnect(peer);
    }
});