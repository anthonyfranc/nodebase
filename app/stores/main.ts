import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", {
  state: () => ({
    boolean: false as boolean,
  }),
  actions: {
    setBoolean(value: boolean) {
      this.boolean = value;
      this.boolean = false;
    },
  },
});