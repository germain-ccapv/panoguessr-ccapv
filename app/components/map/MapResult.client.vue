<script setup lang="ts">
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPolyline, LIcon } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted, watch } from "vue";
import type {GeoPoint} from "~~/types/geo";

const props = defineProps<{
  startPosition: GeoPoint;
  endPosition: GeoPoint;
}>();

const mapRef = ref<InstanceType<typeof LMap> | null>(null);
const defaultZoom = 7;
const mapCenter = ref<GeoPoint>({
  lat: props.startPosition.lat,
  lng: props.startPosition.lng,
});

const adjustMapBounds = () => {
  if (!mapRef.value) return;

  const leafletMap = mapRef.value?.leafletObject;
  if (!leafletMap) return;

  if (props.endPosition.lng !== 0 && props.endPosition.lat !== 0) {
    const point1 = L.latLng([props.startPosition.lat, props.startPosition.lng]);
    const point2 = L.latLng([props.endPosition.lat, props.endPosition.lng]);

    const bounds = L.latLngBounds([point1, point2]);

    leafletMap.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15
    });
  } else {
    leafletMap.setView(
        [props.startPosition.lat, props.startPosition.lng],
        defaultZoom
    );
  }
};

watch(() => mapRef.value?.ready, (ready) => {
  if (ready) {
    adjustMapBounds();
  }
});

watch(
    () => [props.startPosition, props.endPosition],
    () => {
      if (mapRef.value?.ready) {
        adjustMapBounds();
      }
    },
    { deep: true }
);
</script>

<template>
  <div class="map-result-wrapper">
    <LMap
        ref="mapRef"
        class="map"
        :zoom="defaultZoom"
        :center="[mapCenter.lat, mapCenter.lng]"
        :use-global-leaflet="true"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />
      <LMarker :lat-lng="[props.startPosition.lat, props.startPosition.lng]">
        <LIcon iconUrl="flag.png"
               :icon-size="[32, 32]"
               :icon-anchor="[16, 32]"
        />
      </LMarker>
      <LMarker v-if="props.endPosition.lng !== 0 && props.endPosition.lat !== 0"
               :lat-lng="[props.endPosition.lat, props.endPosition.lng]"/>
      <LPolyline v-if="props.endPosition.lng !== 0 && props.endPosition.lat !== 0"
                 :lat-lngs="[
                   [props.startPosition.lat, props.startPosition.lng],
                   [props.endPosition.lat, props.endPosition.lng]
                 ]"/>
    </LMap>
  </div>
</template>

<style scoped lang="scss">
.map-result-wrapper {
  height: 50vh;
  width: 100%;
  border-radius: 10px;
  border: 4px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  .map {
    height: 100%;
    width: 100%;
  }
}
</style>