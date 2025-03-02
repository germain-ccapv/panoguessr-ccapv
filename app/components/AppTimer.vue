<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import {Howl} from "howler";

interface Props {
  start: number,
}

const clockTickingSound = useState<Howl>('clock-ticking-sound');
const router = useRouter();
const props = withDefaults(defineProps<Props>(), {
  start: 10,
});

const emits = defineEmits<{
  timeout: [];
}>();

const timer = ref<number>(props.start);
const interval = ref<NodeJS.Timeout | null>(null);

const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `${minutes} : ${seconds.toString().padStart(2, '0')}`;
});

const startCountdown = () => {
  if (interval.value) clearInterval(interval.value);
  timer.value = props.start;

  interval.value = setInterval(async () => {
    if (timer.value > 0) {
      timer.value--;

      if (timer.value == 10) startTickSound();
      if (timer.value == 1) stopTickSound();
    } else {
      clearInterval(interval.value!);
      emits('timeout');
    }
  }, 1000);
};

function startTickSound() {
  if (clockTickingSound.value) {
    clockTickingSound.value.stop();
    clockTickingSound.value.play();
    clockTickingSound.value.fade(0, 0.2, 1000);
  }
}

function stopTickSound() {
  if (clockTickingSound.value) {
    clockTickingSound.value.fade(0.2, 0, 2000);
  }
}

onMounted(() => {
  if (!clockTickingSound.value) {
    clockTickingSound.value = new Howl({
      src: '/sounds/ticking.wav',
      volume: 0.2,
    });
  }
  startCountdown();
});

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});

watch(() => props.start, startCountdown);

</script>

<template>
  <div :class="['timer-container', timer > 0 ? 'timer-active' : 'timer-ended', timer <= 10 && timer > 0 ? 'timer-warning' : '']">
    <span>{{ formattedTime }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.timer-container {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 3px;
  font-family: "Neo Extra", sans-serif;
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 1px;
  transform: translateY(0px) skew(-10deg);
  transition: all 0.25s;
  width: fit-content;

  &.timer-active {
    background: linear-gradient(-10deg, white 0%, $blue-shade-1 110%);
    color: $darker-color;
  }

  &.timer-ended {
    opacity: 0.75;
    background-color: $darker-color;
    color: $blue-shade-1;
  }

  &.timer-warning {
    animation: blink-red 1s step-end infinite;
  }
}

@keyframes blink-red {
  0%, 100% {
    background: linear-gradient(-10deg, $yellow-shade-2 0%, $yellow-shade-4 110%);
    color: white;
  }
  50% {
    background: linear-gradient(-10deg, white 0%, $blue-shade-1 110%);
    color: $darker-color;
  }
}
</style>
