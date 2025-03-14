import { defineStore } from "pinia";
export const useNavigatorStore = defineStore('navigator', {
    state: () => {
        return {
            page:'',
            subpage:''
        };
    },
    getters: {
        getPage(){
            return this.page;
        },
        getSubpage(){
            return this.subpage;
        }
    },
    actions: {
        setPage(page){
            this.page = page;
        },
        setSubpage(subpage){
            this.subpage = subpage;
        }
    }
});