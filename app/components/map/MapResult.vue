<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import type {GeoPoint} from "~~/types/geo";

const props = defineProps<{
  startPosition: GeoPoint;
  endPosition: GeoPoint;
}>();

// Set the map reference and initial zoom/center settings
const map = ref<LMap>(null);
const defaultZoom = 5;
const mapCenter = ref<GeoPoint>({
  lat: (props.startPosition.lat + props.endPosition.lat) / 2,
  lng: (props.startPosition.lng + props.endPosition.lng) / 2,
});
</script>

<template>
  <div class="map-result-wrapper">
    <LMap
        ref="map"
        class="map"
        :zoom="defaultZoom"
        :center="[mapCenter.lat, mapCenter.lng]"
        :use-global-leaflet="false"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />
      <LMarker :lat-lng="[props.startPosition.lat, props.startPosition.lng]" />
      <LMarker :lat-lng="[props.endPosition.lat, props.endPosition.lng]" />

      <LPolyline :lat-lngs="[
        [props.startPosition.lat, props.startPosition.lng],
        [props.endPosition.lat, props.endPosition.lng]
      ]" />
    </LMap>
  </div>
</template>

<style scoped lang="scss">
.map-result-wrapper {
  height: 500px;
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
