<script setup lang="ts">
import {useUserStore} from "~/stores/user";

const userStore = useUserStore();
const musicStore = useMusiqueStore();
function updateMusic() {
  musicStore.toggleMusic();
}
</script>

<template>
  <div class="header_container">
    <!--<div class="user-profile">
      <div class="user-info">
        <div class="username">{{ userStore.username }}</div>
        <div class="level">LVL {{ userStore.level }}</div>
      </div>
      <div class="level-info">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: userStore.progress + '%' }"></div>
        </div>
      </div>
    </div>-->
    <div class="vol_button">
      <Icon v-if="musicStore.isPlaying" @click="updateMusic()" name="tabler:volume"/>
      <Icon v-else @click="updateMusic()" name="tabler:volume-off"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.header_container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .vol_button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    background-color: $dark-color;
    border: 2px solid $blue-shade-2;
    border-radius: 100px;
    cursor: pointer;
  }

  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    text-align: center;
    min-width: 125px;

    .user-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      gap: 1rem;

      .username {
        font-family: 'Mahoda', sans-serif;
        color: $white-color;
      }

      .level {
        font-size: 0.75rem;
        font-family: 'Neo Bold', sans-serif;
        color: $white-color;
      }
    }

    .level-info {
      display: flex;
      flex-direction: row;
      width: 100%;

      .progress-bar-container {
        width: 100%;
        height: 8px;
        background-color: $white-color;
        border-radius: 5px;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(to right, $yellow-shade-1, $yellow-shade-4);
        transition: width 0.3s ease;
      }
    }

    @media screen and (max-width: 500px) {
      display: none;
    }
  }

}
</style>

