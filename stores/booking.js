import { defineStore } from "pinia";

export const useBookingStore = defineStore('booking', {
  state: () => {
    return {
        bookings:[],
        hasNextPage:false,
        currentPage:1
    };
  },
  getters: {
    getPrevState: (state) => {
      return state.previousState
    },
    bookingList:(state)=>{
        return state.bookings;
    },
    getCurrentPage:(state)=>{
      return state.currentPage;
    },
    getHasNextPage:(state)=>{
      return state.hasNextPage;
    }
  },
  actions: {
    setPrevState(value) {
      this.previousState = value;
    },
    setBooking(value){
        this.bookings = value;
    },
    addBooking(value){
        this.bookings.push(value);
    },
    findBooking(id){
        let filter = this.bookings.filter(item=>{
            return item.id == id;
        })
        return filter.length > 0 ? filter[0] : null;
    },
    deleteBooking(id){
        let newArray = this.bookings.filter(function( obj ) {
            return obj.id !== id;
        });
        this.bookings = newArray;
    },
    setHasNextPage(hasPage){
        this.hasNextPage = hasPage;
    },
    setCurrentPage(page){
        this.currentPage = page;
    }
  },
  persist:true

})