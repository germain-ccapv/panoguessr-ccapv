<script setup lang="ts">
const { data } = useFetch("/api/start-new-game", {
  method: 'POST'
});

const pictureId = ref<string | null>(null);

watch(data, () => {
  pictureId.value = data.value.locationId
})

function onValidate(position: any) {
  // TODO: Send validation to the API
  console.log({position});
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
<script setup lang="ts">
</script>