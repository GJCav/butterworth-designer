<template>
  <div ref="chart_dom" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as echarts from "echarts"
import * as mjs from "mathjs"
import _ from "lodash"
import { encode_scale_unit } from "~/dsp/parser"

export default {
  name: "LPFMagRes",

  props: {
    order: { type: Number, default: 3 },
    cutoff: { type: Number, default: 1000 },
    dcGain: { type: Number, default: 0 }
  },

  data: () => ({
    chart: null,
  }),

  watch: {
    order() { this.update_chart() },
    cutoff() { this.update_chart() },
    dcGain() { this.update_chart() }
  },

  mounted() {
    // init poles diagram
    const option = {
      title: { text: "Magnitude Response" },
      tooltip: { trigger: "none" },
      legend: { show: false },
      xAxis: {
        name: "f (Hz)",
        type: "log",
        position: "bottom",
        axisLine: { onZero: false },
        axisLabel: {
          formatter: value => (encode_scale_unit(value, 3))
        }
      },
      yAxis: {
        name: "|H(jw)| (dB)",
        type: "value"
      },
      series: [{
        name: "mag",
        type: "line",
        smooth: false,
        symbol: "none",
        data: []
      }]
    }
    if (this.chart == null) {
      const chart_dom = this.$refs.chart_dom
      this.chart = echarts.init(chart_dom)
    }
    this.chart.setOption(option)
  },

  methods: {
    update_chart: _.debounce(function () {
      const N = this.order
      const w_c = this.cutoff
      if (N == null || w_c == null) {
        return
      }
      
      const data = []
      const sample_n = 1000
      const upper_bound = 7 * w_c
      const step = upper_bound / sample_n

      for (let i = 1; i <= sample_n; i++) {
        const w = i * step
        const H = 1 / mjs.sqrt(1 + mjs.pow(w / w_c, 2 * N))
        const dB = 20 * mjs.log(H, 10) + this.dcGain
        data.push([w / 2 / Math.PI, dB])
      }

      this.chart.setOption({
        series: [{
          name: "mag",
          data
        }]
      })
    }, 300)
  },
}
</script>