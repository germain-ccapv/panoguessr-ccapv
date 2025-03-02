<script setup lang="ts">
import {Howl} from 'howler';
import type {GeoPoint} from "~~/types/geo";

const {data} = useFetch("/api/start-new-game", {
  method: 'POST'
});

const clockTickingSound = useState<Howl>('clock-ticking-sound');

const pictureId = ref<string | null>(null);
const loaderReady = ref<boolean>(false);
const router = useRouter();
const positionStore = usePositionStore();
const roundStore = useRoundStore();
const musicStore = useMusiqueStore();

watch(data, () => {
  pictureId.value = data.value.locationId;
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

async function timeOutValidation() {
  const resp = await $fetch(`/api/end-game`, {
    method: 'POST',
    body: {
      originPicId: pictureId.value,
      guessPosition: {lat: 0, lng: 0},
    }
  });

  if (clockTickingSound.value) {
    clockTickingSound.value.fade(0.2, 0, 500);
    clockTickingSound.value = null;
  }

  positionStore.setStartPosition(resp.originPoint.lat, resp.originPoint.lng);
  positionStore.setEndPosition(0, 0);
  positionStore.setDistance(resp.distance_meters);

  await router.push('/result');
}

onMounted(() => {
  if(musicStore.isPlaying) {
    musicStore.pause();
  }
});

function updateMusic() {
  musicStore.toggleMusic();
}
</script>

<template>
  <div class="page">
    <div v-if="!pictureId" class="loading">
      <AppButton>Round {{roundStore.round}} / 5</AppButton>
      <div class="title">Chargement...</div>
    </div>
    <template v-else>
      <div v-if="loaderReady" class="countdown">
        <div class="row-top">
          <AppButton>Round {{roundStore.round}} / 5</AppButton>
          <div class="vol_button">
            <Icon v-if="musicStore.isPlaying" @click="updateMusic()" name="tabler:volume"/>
            <Icon v-else @click="updateMusic()" name="tabler:volume-off"/>
          </div>
        </div>
        <AppTimer :start="120" @timeout="timeOutValidation"/>
      </div>
      <MapViewer :picture-id="pictureId" @picready="() => loaderReady = true" />
      <MapSelect @validate="onValidate"/>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.countdown {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: end;
  z-index: 1000;
  top: 1rem;
  right: 1rem;
  margin: 1rem;
  gap: 1rem;

  .row-top {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: center;

    .vol_button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      background-color: $dark-color;
      border: 2px solid $blue-shade-2;
      border-radius: 100px;
      cursor: pointer;
    }
  }
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
