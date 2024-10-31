<script>
export default {
  name: "UserProfile",
  data() {
    return {
      user: {
        username: "JohnDoe",
        profilePicture: "/images/profile.jpg",
        level: 5,
        progress: 70,
      },
    };
  },
  computed: {
    progressBarWidth() {
      return this.user.progress;
    },
  },
};
</script>

<template>
  <div class="user-profile">
    <div class="user-info">
      <div class="username">{{ user.username }}</div>
      <div class="level">LVL {{ user.level }}</div>
    </div>
    <div class="level-info">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/styles/global';

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  text-align: center;
  min-width: 125px;
}

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
</style>

