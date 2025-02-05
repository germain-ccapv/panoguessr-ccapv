<script setup lang="ts">
import { Viewer } from '@panoramax/web-viewer/build/index';

const props = defineProps<{
  pictureId: string;
}>();

const viewer = ref();

onMounted(() => {
  viewer.value = new Viewer("viewer",
      "https://api.panoramax.xyz/api",
      {
        map: false,
        hash: false,
        selectedPicture: props.pictureId
      }
  );
})
</script>

<template>
  <div id="viewer"></div>
</template>

<style scoped>
#viewer {
  font-size: initial;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 600px) {
    height: 80% !important;
    width: 100% !important;
    position: fixed;
    top: 0;
    right: 0;
  }
}

:deep(#gvs-widget-legend) {
  display: none;
}

:deep(#gvs-widget-share) {
  display: none;
}

:deep(#gvs-widget-player) {
  display: none;
}
</style>
