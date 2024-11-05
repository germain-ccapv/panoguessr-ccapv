<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from 'vue';

const router = useRouter();

const positionStore = usePositionStore();
const startPosition = computed(() => positionStore.startPosition);
const endPosition = computed(() => positionStore.endPosition);
const distanceMeters = computed(() => positionStore.distance);

function play() {
  router.push("/game");
}

</script>

<template>
  <div class="page">
    <div class="result">
      <h1>Résultat</h1>
      <h4 class="distance">Distance : {{ distanceMeters }} mètres</h4>
      <MapResult :start-position="startPosition" :end-position="endPosition" />
      <AppButton @click="play">Rejouer</AppButton>
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
