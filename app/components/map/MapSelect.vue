<script setup lang="ts">
import {LMap, LTileLayer, LMarker} from "@vue-leaflet/vue-leaflet";

interface Position {
  lat: number;
  lng: number;
}

const map = ref<LMap>(null)
const isMapBigger = ref<boolean>(false);
const position = ref<Position>({lat: 0, lng: 0});

const emits = defineEmits<{
  validate: [position: Position];
}>();

const canValidatePosition = computed<boolean>(() => position.value.lat !== 0 && position.value.lng !== 0);

function onMapClick(event: any) {
  position.value = event.latlng;
}

function onMapOut() {
  isMapBigger.value = false;
}

function onMapIn() {
  isMapBigger.value = true;
  resetMapSize();
}

function validatePosition() {
  emits('validate', position.value)
}

function resetPosition() {
  position.value = {lat: 0, lng: 0};
}

function resetMapSize() {
  nextTick(() => {
    setTimeout(() => {
      map?.value.leafletObject.invalidateSize()
    }, 300);
  });
}

defineExpose({
  resetPosition
});

</script>

<template>
  <div class="map-wrapper" :class="{ 'bigger': isMapBigger }">
    <Transition name="fade" mode="out-in">
      <AppButton v-if="canValidatePosition" class="validate-btn" @click="validatePosition" @mouseover="onMapIn">Valider</AppButton>
    </Transition>
    <LMap
        ref="map"
        class="map"
        :zoom="5"
        :center="[46.5, 2.2]"
        :use-global-leaflet="false"
        @click="onMapClick"
        @mouseout="onMapOut"
        @mouseover="onMapIn"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />
      <LMarker :lat-lng="[position.lat, position.lng]"/>
    </LMap>
  </div>
</template>

<style scoped lang="scss">
.map-wrapper {
  height: 35vh !important;
  width: 35vw !important;
  transition: .3s ease;
  position: fixed;
  bottom: 10px;
  right: 10px;
  border-radius: 10px;
  border: 4px solid white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media screen and (max-width: 600px) {
    height: 20% !important;
    width: 100% !important;
    position: fixed;
    bottom: 0;
    right: 0;
  }

  &.bigger {
    height: 70vh !important;
    width: 50vw !important;

    @media screen and (max-width: 600px) {
      height: 33% !important;
      width: 100% !important;
    }
  }

  .validate-btn {
    position: absolute;
    bottom: 20px;
    right: 10px;
    z-index: 1;
  }

  .map {
    z-index: 0;
  }
}
</style>
