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
const noGuess = computed(() => endPosition.value.lat === 0 && endPosition.value.lng === 0);
//const points = noGuess.value ? 0 : Math.round(5000 * Math.pow(0.9999925, distanceMeters.value));

const MAX_DISTANCE = 150_000; // 100 km en mètres : au-delà, 0 point

const points = noGuess.value || distanceMeters.value >= MAX_DISTANCE
  ? 0
  : Math.round(5000 * Math.exp(-distanceMeters.value / 6000));
roundStore.addScore(points);

function play() {
  if (roundStore.round === 5) {
    roundStore.reset();
    router.push("/");
  } else {
    roundStore.nextRound();
    router.push("/game");
  }
}

function formatDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
  }
  return `${distance.toLocaleString('fr-FR')} m`;
}
const formattedDistance = computed(() => formatDistance(distanceMeters.value));

</script>

<template>
  <div class="page">
    <div class="result">
      <div class="title">
        <div class="result_title">Résultat : {{ points }} points. </div>
        <div class="total_title">(Total : {{ roundStore.score }} points)</div>
      </div>
      <h4 v-if="!noGuess" class="distance">Distance : {{ formattedDistance }}</h4>
      <h4 v-if="noGuess" class="distance">Temps écoulé !</h4>
      <MapResult :start-position="startPosition" :end-position="endPosition" />
      <AppButton @click="play">{{ roundStore.round === 5 ? 'Terminer' : 'Suivant' }}</AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">

@use '~/assets/styles/global' as *;

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;

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

    .title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;

      .result_title {
        font-size: 1.5rem;
        font-family: 'Neo Bold', sans-serif;
        color: $white-color;
      }

      .total_title {
        font-size: 1rem;
        font-family: 'Neo Bold', sans-serif;
        color: $blue-shade-1;
      }
    }
  }
}
</style>
