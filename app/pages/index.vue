<script lang="ts" setup>
import Modal from "~/components/app/Modal.vue";

const multiplayer = useMultiplayer();
const musicStore = useMusiqueStore();

const multiplayerMenu = ref<boolean>(false);
const multiplayerMenuOpened = ref<boolean>(false);
const multiplayerMenuCodeOpened = ref<boolean>(false);
const pseudoInputOpened = ref<boolean>(false);

const joinGameId = ref<string>("");
const pseudo = ref<string>("");

onMounted(() => {
  multiplayer.initializeWebSocket();
})

function openMultiplayerMenu() {
  multiplayerMenu.value = true;
  multiplayerMenuOpened.value = true;
  multiplayerMenuCodeOpened.value = false;
  pseudoInputOpened.value = false;
}

function joinGame() {
  if (pseudo.value && joinGameId.value) {
    multiplayer.joinGame(joinGameId.value, pseudo.value);
  } else {
    multiplayer.createGame(pseudo.value);
  }
  multiplayerMenu.value = false;
}

function openPseudoInput() {
  multiplayerMenuCodeOpened.value = false;
  multiplayerMenuOpened.value = false;
  pseudoInputOpened.value = true;
}

function openCodeInput() {
  pseudoInputOpened.value = false;
  multiplayerMenuOpened.value = false;
  multiplayerMenuCodeOpened.value = true;
}

function backToMenu() {
  pseudoInputOpened.value = false;
  multiplayerMenuCodeOpened.value = false;
  multiplayerMenuOpened.value = true;
}

function startGame() {
  multiplayer.startGame();
}
</script>

<template>
  <Modal :title="pseudoInputOpened ? 'Pseudo' : multiplayerMenuCodeOpened ? 'Code de la partie' : 'Multijoueur'" v-model:isVisible="multiplayerMenu">
    <template #body class="join-container" v-if="pseudoInputOpened">
      <input v-model="pseudo" placeholder="Entrez votre pseudo" class="game-code-input" />
      <div class="inline_btn">
        <AppButton @click="backToMenu">Retour</AppButton>
        <AppButton @click="joinGame">Jouez !</AppButton>
      </div>
    </template>
    <template #body class="join-container" v-if="multiplayerMenuCodeOpened">
      <input v-model="joinGameId" placeholder="Entrez un code de partie" class="game-code-input" />
      <div class="inline_btn">
        <AppButton @click="backToMenu">Retour</AppButton>
        <AppButton @click="openPseudoInput">Valider</AppButton>
      </div>
    </template>
    <template #body class="join-container" v-if="multiplayerMenuOpened">
      <AppButton @click="openPseudoInput">Créer une partie</AppButton>
      <AppButton @click="openCodeInput">Rejoindre une partie</AppButton>
    </template>
  </Modal>
  <Modal title="Salle d'attente" v-model:isVisible="multiplayer.gameId">
    <template #body class="game-lobby">
      <div class="game-code">Code de la partie: <span class="bold_code">{{ multiplayer.gameId }}</span></div>
      <div class="players-list">
        <div class="players_title">Joueurs :</div>
        <ul>
          <AppAvatar  v-for="player in multiplayer.players" :key="player.id" :pseudo="player.username"/>
        </ul>
      </div>
      <AppButton v-if="multiplayer.players[0]?.id === multiplayer.playerId" @click="startGame">Démarrer la partie</AppButton>
    </template>
  </Modal>
  <div class="container">
    <AppHeader :music="musicStore.isPlaying"/>
    <div class="homepage">
      <div class="left">
        <div class="home-title">Bienvenue !</div>
        <div class="home-subtitle">PANOGUESSR est un jeu <span class="blue">collaboratif</span> et <span class="blue">open-source</span> qui teste vos connaissances en géographie.</div>
        <div>
          <div class="buttons">
            <NuxtLink href="/game"><AppButton>Partie solo</AppButton></NuxtLink>
            <AppButton @click="openMultiplayerMenu">Multijoueur</AppButton>
            <NuxtLink href="/credits"><AppButton>Crédits</AppButton></NuxtLink>
          </div>
        </div>
      </div>

      <div class="right">
        <img src="~/assets/world.svg" alt="world" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.blue {
  text-decoration: underline 5px solid $blue-shade-1;
  text-underline-offset: 8px
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-inline: 50px;
  margin-top: 20px;
  gap: 2rem;


  @media screen and (max-width: 500px) {
    margin-inline: 20px;
  }
}

.homepage {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 100%;
  gap: 1rem;

  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
}

.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  height: 100%;
  gap: 2rem;
}

.home-title {
  font-family: "Neo Extra", sans-serif;
  font-size: 4rem;
  color: $white-color;


  @media screen and (max-width: 500px) {
    font-size: 2rem;
  }
}

.home-subtitle {
  font-family: "Neo Extra", sans-serif;
  font-size: 1.5rem;
  text-align: justify;
  line-height: 2.5rem;
  max-width: 85%;
  color: $white-color;
}

.buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 25px;
  align-items: start;
  gap: 2rem;
}

.join-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.inline_btn {
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.game-code-input {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 1.25rem;
  font-family: "Neo Extra", sans-serif;
  border: 1px solid $blue-shade-1;
  background: transparent;
  color: $white-color;
}

.game-lobby {
  color: $white-color;
  width: 100%;
}

.game-code {
  font-family: "Neo Regular", sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: rgba($blue-shade-1, 0.2);
  border-radius: 4px;
}

.bold_code {
  font-family: "Neo Extra", sans-serif;
  font-size: 1.25rem;
}

.players-list {
  margin: 1rem 0;
}

.players_title {
  font-family: "Neo Bold", sans-serif;
  font-size: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  font-family: "Neo Extra", sans-serif;
}

li {
  color: $white-color;
  list-style: disc inside;
  padding: 0.5rem 0;
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  img {
    transform: scale(0.85);
    object-fit: cover;
    animation: bounce 10s infinite;
  }
}

.footer {
  font-family: "Neo Regular", sans-serif;
  font-size: 1rem;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-30px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-15px); }
}
</style>
