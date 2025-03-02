import { defineStore } from 'pinia'
import {Howl} from "howler";

const music = new Howl({
    src: '/sounds/music.mp3',
    volume: 0.05,
    loop: true
});

export const useMusiqueStore = defineStore('musique', {
    state: () => ({
        isPlaying: true,
    }),
    actions: {
        play() {
            music.play();
            this.isPlaying = true;
        },
        pause() {
            music.pause();
            this.isPlaying = false;
        },
        toggleMusic() {
            this.isPlaying ? this.pause() : this.play();
        }
    },
})
