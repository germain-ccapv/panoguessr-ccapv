<script setup lang="ts">
import {Howl} from 'howler';
import type {GeoPoint} from "~~/types/geo";

const {data} = useFetch("/api/start-new-game", {
  method: 'POST'
});

const musicPlaying = useState<Howl>('music-playing');
const clockTickingSound = useState<Howl>('clock-ticking-sound');

const pictureId = ref<string | null>(null);
const router = useRouter();
const positionStore = usePositionStore();

watch(data, () => {
  pictureId.value = data.value.locationId
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
    <div v-if="!pictureId" class="loading">Chargement...</div>
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
</style>
