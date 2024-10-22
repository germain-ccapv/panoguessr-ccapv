<script setup lang="ts">
function onValidate(position: any) {
  // TODO: Send validation to the API
  console.log({position});
}
</script>

<template>
  <div class="page">
    <MapViewer picture-id="f99e2bf3-a8c5-4ae0-824e-4f1bfa3f7caa"/>
    <MapSelect @validate="onValidate"/>
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