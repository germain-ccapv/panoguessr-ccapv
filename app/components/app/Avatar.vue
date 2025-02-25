<script setup lang="ts">
const props = defineProps<{
  pseudo: string,
}>()

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
</script>

<template>
  <div class="avatar_container">
    <div class="avatar_icon" :style="{ 'background-color': getColorCodeFromName(pseudo)}">
      {{pseudo.slice(0,1).toUpperCase()}}{{pseudo.slice(1,2).toLowerCase()}}
    </div>
    <div class="avatar_name">{{pseudo}}</div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.avatar_container {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  padding-top: 1rem;
  justify-content: start;
  align-items: center;

  .avatar_icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
    border: 2px solid;
    text-align: center;
    border-radius: 100px;
    line-height: 10px;
  }
}

</style>

