<script setup lang="ts">
interface Props {
  disabled?: boolean,
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})
</script>

<template>
  <button :class="[disabled ? 'btn-locked' : 'btn']">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.btn {
  background: linear-gradient(-10deg, $blue-shade-4 0%, $blue-shade-3 110%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.85rem 2.5rem;
  border: none;
  box-shadow: inset 0 0 3px 0.25px $shadow-color, 0 1px 3px 0.25px $shadow-color;
  border-radius: 3px;
  cursor: pointer;
  font-family: "Neo Extra", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.25s;
  transform: translateY(0px) skew(-10deg);
  gap: 0.3rem;

  &:hover {
    background: linear-gradient(-10deg, $blue-shade-4 0%, $blue-shade-2 110%);
    box-shadow: none;
    transform: translateY(-3px) skew(-10deg);
    transition: all 0.25s;
  }
}

.btn-locked {
  background: linear-gradient(-10deg, $blue-shade-4 0%, $blue-shade-3 110%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.85rem 2.5rem;
  border: none;
  box-shadow: inset 0 0 3px 0.25px $shadow-color, 0 1px 3px 0.25px $shadow-color;
  border-radius: 3px;
  font-family: "Neo Extra", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  transform: translateY(0px) skew(-10deg);
  gap: 0.3rem;
  opacity: 0.65;
}
</style>
