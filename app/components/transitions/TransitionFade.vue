<template>
  <Transition name="fade">
    <slot/>
  </Transition>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: 250ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}
</style>