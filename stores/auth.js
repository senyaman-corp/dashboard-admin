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
            const { $parseJwt} = useNuxtApp();
            let parseToken = $parseJwt(this.token);
            if(!parseToken){
                return false
            }
            var expDate = new Date(parseToken.exp * 1000);
            if(new Date() > expDate){
                this.loggedin = false;
            }
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