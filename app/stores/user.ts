import { defineStore } from 'pinia'

export interface User {
    username: string,
    profilePicture: string,
    level: number,
    progress: number,
}

export const useUserStore = defineStore('user', {
    state: () => ({
        username: "JohnDoe",
        profilePicture: "/images/profile.jpg",
        level: 1,
        progress: 25,
    }),
    actions: {
        setUser(user: User) {
            this.username = user.username;
            this.profilePicture = user.profilePicture;
            this.level = user.level;
            this.progress = user.progress;
        },
    },
})
