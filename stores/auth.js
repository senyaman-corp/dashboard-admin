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
            let user = this.getUser;
            if(user.roles == null){
                return false
            }
            if(user.roles == 'Admin'){
                return true
            }
            return user.roles.toLowerCase() == page.toLowerCase();    
        },
        isSupervisor(){
            let user = this.getUser;
            return user.jabatan.toLowerCase() == 'supervisor';
        }

    },
    persist:true
});