<script setup lang="ts">
import L from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolyline,
} from "@vue-leaflet/vue-leaflet";
import { ref, onMounted, watch, computed } from "vue";
import type { GeoPoint } from "~~/types/geo";

const props = defineProps<{
  points: Array<GeoPoint & { isTarget?: boolean } & { username?: string }>;
}>();

const mapRef = ref<InstanceType<typeof LMap> | null>(null);
const defaultZoom = 7;
const mapCenter = ref<GeoPoint>({
  lat: props.points.length > 0 ? props.points[0].lat : 0,
  lng: props.points.length > 0 ? props.points[0].lng : 0,
});

const targetPoint = computed(() => {
  return props.points.find(point => point.isTarget) || props.points[0];
});

const guessPoints = computed(() => {
  return props.points.filter(point => !point.isTarget);
});

const adjustMapBounds = () => {
  if (!mapRef.value || !mapRef.value.leafletObject) return;

  const leafletMap = mapRef.value.leafletObject;
  const validPoints = props.points.filter(isValidPoint);

  if (validPoints.length > 1) {
    const latLngs = validPoints.map((point) => L.latLng(point.lat, point.lng));
    const bounds = L.latLngBounds(latLngs);

    leafletMap.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  } else if (validPoints.length === 1) {
    leafletMap.setView(
        [validPoints[0].lat, validPoints[0].lng],
        defaultZoom
    );
  }
};

function isValidPoint(p) {
  return p.lat != 0 || p.lng != 0;
}

watch(
    () => mapRef.value?.ready,
    (ready) => {
      if (ready) {
        adjustMapBounds();
      }
    }
);

watch(
    () => props.points,
    () => {
      if (mapRef.value?.ready) {
        nextTick(() => {
          adjustMapBounds();
        })
      }
    },
    { deep: true }
);

onMounted(() => {
  nextTick(() => {
    adjustMapBounds();
  })
})

function getColorCodeFromName(name: string) {
  if (!name) return '#000000';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

const createDivIcon = (avatar: string | undefined) => {
  if(avatar) {
    const backgroundColor = getColorCodeFromName(avatar);
    const name = avatar.slice(0,1).toUpperCase() + avatar.slice(1,2).toLowerCase();
    return L.divIcon({
      className: 'avatar-marker',
      html: `<div class="avatar-wrapper" style="background-color: ${backgroundColor}">${name}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }
  else {
    return L.icon({iconUrl: "flag.png", iconSize: [32, 32], iconAnchor: [16, 32]});
  }
};
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
          attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />
      <LMarker
          v-for="(point, index) in props.points.filter(isValidPoint)"
          :key="index"
          :lat-lng="[point.lat, point.lng]"
          :icon="createDivIcon(point.isTarget ? undefined : point.username)"
      >
      </LMarker>
      <template v-if="props.points.length > 1">
        <LPolyline
            v-for="(point, index) in guessPoints.filter(isValidPoint)"
            :key="index"
            :color="getColorCodeFromName(point.username!)"
            :lat-lngs="[
            [targetPoint.lat, targetPoint.lng],
            [point.lat, point.lng],
          ]"
        />
      </template>
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

  :deep(.avatar-marker) {
    background: none;
    border: none;

    .avatar-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-weight: bold;
      background-color: white;
      border: 2px solid #021c23;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  :deep(.flag-marker) {
    background: none;
    border: none;
  }
}
</style>