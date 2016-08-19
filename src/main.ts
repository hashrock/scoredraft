import * as Vue from "vue";
import {sum} from "./lib";
import {App} from "./app";

console.log(sum(1, 2));

new Vue({
  el: "main",
  components: {
    "app": App
  }
})
