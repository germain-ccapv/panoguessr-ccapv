<script setup lang="ts">
import { Viewer } from '@panoramax/web-viewer/build/index';
import { getAPIUrl } from '#imports';

const props = defineProps<{
  pictureId: string;
}>();

const emit = defineEmits(['picready'])

const viewer = ref<Viewer | null>(null);

watch(() => props.pictureId, (newPictureId) => {
  if (viewer.value) {
    viewer.value.select(null, newPictureId, true);
  }
});

onMounted(() => {
  viewer.value = new Viewer("viewer", getAPIUrl(), {
    map: false,
    hash: false,
    selectedPicture: props.pictureId
  });
  viewer.value.addEventListener("ready", () => viewer.value.psv.setTransitionDuration(500));
  viewer.value.addEventListener("psv:picture-loaded", () => emit("picready"));
});
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

:deep(#gvs-widget-legend),
:deep(#gvs-widget-share),
:deep(#gvs-widget-player) {
  display: none;
}
</style>
