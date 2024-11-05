<script setup lang="ts">
import type {GeoPoint} from "~~/types/geo";

const { data } = useFetch("/api/start-new-game", {
  method: 'POST'
});

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

  positionStore.setStartPosition(10, 32);
  positionStore.setEndPosition(position.lat, position.lng);
  positionStore.setDistance(resp.distance_meters);

  await router.push('/result');
}
</script>

<template>
  <div class="page">
    <div v-if="!pictureId" class="loading">Chargement...</div>
    <template v-else>
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
</style>
