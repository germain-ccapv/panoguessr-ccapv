<template>
  <div class="container">
    <AppHeader :music="musicStore.isPlaying"/>
    <div class="homepage">
      <div class="left">
        <div class="home-title">Bienvenue !</div>
        <div class="home-subtitle">PANOGUESSR est un jeu <span class="blue">collaboratif</span> et <span class="blue">open-source</span> qui teste vos connaissances en géographie.</div>
        <div class="buttons">
          <NuxtLink href="/game"><AppButton>Partie solo</AppButton></NuxtLink>
          <AppButton disabled>Multijoueur <Icon name="tabler:lock"/></AppButton>
          <NuxtLink href="/credits"><AppButton>Crédits</AppButton></NuxtLink>
        </div>
      </div>
      <div class="right">
        <img src="~/assets/world.svg" alt="world" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/styles/global';

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

  .homepage {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 95%;
    height: 100%;
    gap: 1rem;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      height: 100%;
      gap: 2rem;

      @media screen and (max-width: 500px) {
        align-items: center;
      }

      .home-title {
        font-family: "Neo Extra", sans-serif;
        font-size: 4rem;
        color: $white-color;

        @media screen and (max-width: 500px) {
          font-size: 3rem;
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

        @media screen and (max-width: 500px) {
          align-items: center;
        }
      }
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      @media screen and (max-width: 915px) {
        display: none;
      }

      img {
        transform: scale(0.85);
        object-fit: cover;
        animation: bounce 10s infinite;
      }
    };
  }
}

.footer {
  font-family: "Neo Regular", sans-serif;
  font-size: 1rem;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(-30px); /* Monte en sautillant */
  }

  50% {
    transform: translateY(0); /* Écrasement à l'atterrissage */
  }

  75% {
    transform: translateY(-15px); /* Petit rebond */
  }
}
</style>

<script setup lang="ts">
const musicStore = useMusiqueStore();
</script>
