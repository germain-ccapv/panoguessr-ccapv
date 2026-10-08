<script setup lang="ts">
import {LMap, LTileLayer, LMarker, LGeoJson} from "@vue-leaflet/vue-leaflet";
import searchArea from '@/assets/data/geo/search_area.json';

interface Position {
  lat: number;
  lng: number;
}

/**
 * Emprise de la CCAPV, calculée à partir de search_area.json
 * (format Leaflet : [[sud, ouest], [nord, est]]).
 */
function computeAreaBounds(): [[number, number], [number, number]] {
  let south = Infinity, west = Infinity, north = -Infinity, east = -Infinity;

  const walk = (coords: any) => {
    if (typeof coords[0] === 'number') {
      const [lng, lat] = coords;
      if (lat < south) south = lat;
      if (lat > north) north = lat;
      if (lng < west) west = lng;
      if (lng > east) east = lng;
      return;
    }
    coords.forEach(walk);
  };

  (searchArea as any).features.forEach((feature: any) => walk(feature.geometry.coordinates));
  return [[south, west], [north, east]];
}

const areaBounds = computeAreaBounds();
const areaCenter: [number, number] = [
  (areaBounds[0][0] + areaBounds[1][0]) / 2,
  (areaBounds[0][1] + areaBounds[1][1]) / 2,
];

// Contour discret du territoire (non cliquable : les clics passent à la carte)
const areaOutlineStyle = () => ({
  color: '#2563eb',
  weight: 2,
  dashArray: '6 6',
  fillOpacity: 0.04,
});

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
  emits('validate', position.value);
  isMapBigger.value = false;
}

function fitToArea() {
  const leafletMap = map.value?.leafletObject;

  if (!leafletMap) return;

  leafletMap.fitBounds(areaBounds, {
    padding: [5, 5],
    animate: false
  });

  leafletMap.setZoom(leafletMap.getZoom() +1);
}

function resetPosition() {
  position.value = {lat: 0, lng: 0};
  fitToArea();
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
    :use-global-leaflet="false"
    @ready="fitToArea"
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
      <LGeoJson
          :geojson="searchArea"
          :options="{ interactive: false }"
          :options-style="areaOutlineStyle"
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

  @media screen and (max-height: 600px) {
    height: 100% !important;
    width: 20% !important;
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