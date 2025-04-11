import { defineStore } from "pinia";

export const useRoomStore = defineStore('room', {
  state: () => {
    return {
        types:[],
    };
  },
  getters:{
    getRoomTypes:(state)=>{
        return state.types;
      }
  },
  actions: {
    setRoomTypes(value){
      this.types = value;
    }
  },
  persist:true
})