import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {

    state: () => {
        return {
            token:null,
            loggedin:false,
            email:null,
            password:null,
            user:null
        };
    },
    getters: {
        getToken(){
            return this.token
        },
        getEmail(){
            return this.token
        },
        getPassword(){
            return this.password;
        },
        getUser(){
           return this.user;
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
        },
        

    },
    actions:{
        setToken(value){
            this.token = value;
        },
        setLoggedin(value){
            this.loggedin = value;
        },
        setEmail(value){
            this.email = value;
        },
        setPassword(value){
            this.password = value;
        },
        updateToken(value){
            this.token = value;
        },
        setUser(value){
            this.user = value;
        },
        isAuthorized(page){
            const { $parseJwt} = useNuxtApp();
            let parseToken = $parseJwt(this.token);
            if(!parseToken){
                return false
            }
            var roles = (parseToken.roles !== null && parseToken.roles !== undefined) ? JSON.parse(parseToken.roles) : [];
            return true;
            //return roles.includes(page);            
        }

    },
    persist:true
});