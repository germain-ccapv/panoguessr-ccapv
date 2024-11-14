<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from 'vue';
import {useRoundStore} from "~/stores/round";

const router = useRouter();

const positionStore = usePositionStore();
const roundStore = useRoundStore();
const startPosition = computed(() => positionStore.startPosition);
const endPosition = computed(() => positionStore.endPosition);
const distanceMeters = computed(() => positionStore.distance);

function play() {
  if (roundStore.round === 5) {
    roundStore.reset();
    router.push("/");
  } else {
    roundStore.nextRound();
    roundStore.addScore(distanceMeters.value);
    router.push("/game");
  }
}

</script>

<template>
  <div class="page">
    <div class="result">
      <h1>Résultat</h1>
      <h4 class="distance">Distance : {{ distanceMeters }} mètres</h4>
      <MapResult :start-position="startPosition" :end-position="endPosition" />
      <AppButton @click="play">{{ roundStore.round === 5 ? 'Terminer' : 'Suivant' }}</AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">

@import "~/assets/styles/global.scss";

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  .result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 70%;

    .distance {
      font-family: 'Neo Bold', sans-serif;
      color: $white-color;
    }

    h1 {
      font-size: 2rem;
      color: $white-color;
    }
  }
}
</style>
