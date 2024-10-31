<script setup lang="ts">

</script>

<template>
  <header class="header">
    <div class="title">PANOGUESSR</div>
    <UserProfile/>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: start;
  padding: 1.25rem 2rem;

  .title {
    font-family: "Mahoda", sans-serif;
    font-size: 2rem;
    color: var(--white-color);
  }

  .header__nav-list {
    display: flex;
    gap: 2.5rem;

    .header__nav-item {
      list-style: none;
    }

    a {
      text-decoration: none;
      color: var(--blue-shade-1);
      font-family: "Neo Regular", sans-serif;
      font-size: 1rem;
      &:hover {
        text-underline-offset: 1rem;
        text-decoration: underline solid var(--white-color);
        color: var(--white-color);
        transition: 0.25s;
      }
    }
  }
}
</style>
