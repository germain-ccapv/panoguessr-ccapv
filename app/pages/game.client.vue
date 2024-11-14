<script setup lang="ts">
import {Howl} from 'howler';
import type {GeoPoint} from "~~/types/geo";
import {useRoundStore} from "~/stores/round";

const {data} = useFetch("/api/start-new-game", {
  method: 'POST'
});

const musicPlaying = useState<Howl>('music-playing');
const clockTickingSound = useState<Howl>('clock-ticking-sound');

const pictureId = ref<string | null>(null);
const router = useRouter();
const positionStore = usePositionStore();
const roundStore = useRoundStore();

watch(data, () => {
  setTimeout(() => {
    pictureId.value = data.value.locationId
  }, 4000);
})

async function onValidate(position: GeoPoint) {
  const resp = await $fetch(`/api/end-game`, {
    method: 'POST',
    body: {
      originPicId: pictureId.value,
      guessPosition: position,
    }
  });

  if (clockTickingSound.value) {
    clockTickingSound.value.fade(0.2, 0, 500);
    clockTickingSound.value = null;
  }

  positionStore.setStartPosition(resp.originPoint.lat, resp.originPoint.lng);
  positionStore.setEndPosition(position.lat, position.lng);
  positionStore.setDistance(resp.distance_meters);

  await router.push('/result');
}

onMounted(() => {
  if (!musicPlaying.value) {
    musicPlaying.value = new Howl({
      src: '/sounds/music.mp3',
      volume: 0.05,
      loop: true
    });

    musicPlaying.value.play();
  }
});
</script>

<template>
  <div class="page">
    <div v-if="!pictureId" class="loading">
      <AppButton>Round {{roundStore.round}} / 5</AppButton>
      <div class="title">Chargement...</div>
    </div>
    <template v-else>
      <div class="countdown">
        <AppTimer :start="60"/>
      </div>
      <MapViewer :picture-id="pictureId"/>
      <MapSelect @validate="onValidate"/>
    </template>
  </div>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.countdown {
  position: absolute;
  z-index: 1000;
  top: 1rem;
  right: 1rem;
  margin: 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  .title {
    font-family: "Mahoda", sans-serif;
    font-size: 1.25rem;
  }
}
</style>
