import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            token:null,
            loggedin:false
        };
    },
    getters: {
        getToken(){
            return this.token
        },
        isLoggedin(){
            return this.loggedin
        }
    },
    actions:{
        setToken(value){
            this.token = value;
        },
        setLoggedin(value){
            this.loggedin = value;
        }

    },
    persist:true
});