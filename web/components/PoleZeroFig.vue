<template>
  <div ref="chart_dom" style="height: 100%; width: 100%;"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "PoleZeroFig",

  props: {
    poles: { type: Array, default: () => ([]) },
    zeros: { type: Boolean, default: () => false }
  },

  data: () => ({
    chart: null
  }),

  watch: {
    poles() {
      if (this.chart) {
        this.chart.setOption({
          series: [{
            name: "pole",
            data: this.poles
          }]
        })
      }
    },

    zeros() {
      if (this.chart) {
        this.chart.setOption({
          series: [
            {
              name: "zero",
              data: this.zeros ? [[0.0001, 0]] : []
            }
          ]
        })
      }
    }
  },

  mounted() {
    // init poles diagram
    const options = {
      title: { text: "Poles & Zeros" },
      legend: { data: ["pole", "zero"] },
      color: ["#f00", "#00f"],
      polar: {},
      tooltip: { trigger: "item", axisPointer: { type: "cross" } },
      angleAxis: { type: "value", startAngle: 0, clockwise: false, max: 360 },
      radiusAxis: { name: "r/w_c", nameLocation: "middle", max: 1.5, interval: 0.5 },
      series: [
        {
          type: "scatter",
          coordinateSystem: "polar",
          name: "pole",
          symbol: "path://M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
          data: []
        },
        {
          type: "scatter",
          coordinateSystem: "polar",
          name: "zero",
          symbol: "path://M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
          data: this.zeros ? [[0.0001, 0]] : []
        }
      ]
    }
    if (this.chart == null) {
      const chart_dom = this.$refs.chart_dom
      this.chart = echarts.init(chart_dom)
    }
    this.chart.setOption(options)
  },
}
</script>