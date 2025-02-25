<script setup lang="ts">
import anime from 'animejs';
import TransitionFade from "~/components/transitions/TransitionFade.vue";

defineProps<{
  title: string
}>()

const isVisible = defineModel<boolean>('isVisible', {default: false})

function onModalEnter(el: Element, done: () => void): void {
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: ['-50%', '-50%'],
    translateY: ['-100%', '-50%'],
    duration: 500,
    easing: 'easeOutElastic(1, 1)',
    complete() { done() }
  })
}

function onModalLeave(el: Element, done: () => void): void {
  anime({
    targets: el,
    opacity: [1, 0],
    translateX: ['-50%', '-50%'],
    translateY: ['-50%', '-70%'],
    duration: 250,
    easing: 'easeInOutCubic',
    complete() { done() }
  })
}
</script>

<template>
  <Teleport to="body">
    <TransitionFade>
      <div v-if="isVisible" class="modal-background" @click="isVisible = false"/>
    </TransitionFade>

    <Transition :css="false" @enter="onModalEnter" @leave="onModalLeave">
      <div class="modal" v-if="isVisible">
        <div class="header">
          <div class="left">
            <div class="title">{{ title }}</div>
          </div>
          <Icon name="uim:multiply" class="icon" @click="isVisible = false"/>
        </div>
        <div class="body">
          <slot name="body"/>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.modal-background {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(8px);
  background-color: rgba($darker-color, .5);
  z-index: 1200;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1210;
  background-color: $dark-color;
  width: 100%;
  height: auto;
  border-radius: 7px;
  padding: 20px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 0 50px 0 rgba($dark-color, 0.05);

  .header {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .icon {
      width: 24px;
      height: 24px;
      color: $white-color;
      cursor: pointer;
    }

    .left {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;

      .icon-sm {
        color: $white-color;
      }

      .title {
        font-family: 'Neo Extra', sans-serif;
        font-size: 16px;
        text-align: center;
        color: $white-color;
      }
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    padding: 15px;
  }
}

</style>
