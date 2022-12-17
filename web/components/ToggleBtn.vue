<template>
  <button :style="btn_style" @click="click">
    <span :style="spot_style"></span>
  </button>
</template>
  
<script>

export default {
  name: "ToggleBtn",

  model: { prop: "value", event: "toggle" },

  props: {
    value: { type: Boolean, default: false },
    color: { type: String, default: "#0078d4" }
  },

  data: () => ({
  }),

  computed: {
    btn_style() {
      return {
        width: "3em",
        height: "1.5em",
        padding: "0 0.3em",
        border: this.value ? "0px" : "1px solid black",
        "border-radius": "1em",
        "background-color": this.value ? this.color : "white",

        transition: "background-color 0.1s ease-out 0s",

        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": this.value ? "end" : "start"
      }
    },

    spot_style() {
      return {
        display: "block",
        width: "0.9em",
        height: "0.9em",
        "border-radius": "1em",
        background: this.value ? "white" : "grey",
      }
    }
  },
  methods: {
    click() {
      this.$emit("toggle", !this.value)
    }
  },
}
</script>