<script setup lang="ts">
import type {GeoPoint} from "~~/types/geo";

const { data } = useFetch("/api/start-new-game", {
  method: 'POST'
});

const pictureId = ref<string | null>(null);

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

  alert("Distance : " + resp.distance_meters);
}
</script>

<template>
  <div class="page">
    <div v-if="!pictureId" class="loading">Chargement...</div>
    <template v-else>
      <div class="countdown">
        <AppTimer :start="15" />
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
<script setup lang="ts">
</script>
