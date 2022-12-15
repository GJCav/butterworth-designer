<template>
  <v-container>
    <h2>目标参数:</h2>
    <v-row class="mt-6 align-baseline" dense>
      <v-col cols="6">
        <v-row class="align-baseline">
          <v-col cols="3" style="text-align: right;">
            <span class="text-h6">\(f_p = \)</span>
          </v-col>
          <v-col cols="9">
            <v-text-field v-model="f_p_i" label="通带频率" outlined dense></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <span class="text-h6">= {{ f_p_val }} Hz</span>
      </v-col>
    </v-row>

    <v-row class="mt-2 align-baseline" dense>
      <v-col cols="6">
        <v-row class="align-baseline">
          <v-col cols="3" style="text-align: right;">
            <span class="text-h6">\(f_s = \)</span>
          </v-col>
          <v-col cols="9">
            <v-text-field v-model="f_s_i" label="阻带频率" outlined dense></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <span class="text-h6">= {{ f_s_val }} Hz</span>
      </v-col>
    </v-row>

    <v-row class="mt-2 align-baseline" dense>
      <v-col cols="6">
        <v-row class="align-baseline">
          <v-col cols="3" style="text-align: right;">
            <span class="text-h6">\(G_0 = \)</span>
          </v-col>
          <v-col cols="9">
            <v-text-field v-model="G_0_i" label="直流增益" outlined dense></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <span class="text-h6">= {{ G_0_val }} dB</span>
      </v-col>
    </v-row>

    <v-row class="mt-2 align-baseline" dense>
      <v-col cols="6">
        <v-row class="align-baseline">
          <v-col cols="3" style="text-align: right;">
            <span class="text-h6">\(A_p = \)</span>
          </v-col>
          <v-col cols="9">
            <v-text-field v-model="A_p_i" label="通带最大衰减" outlined dense></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <span class="text-h6">= {{ A_p_val }} dB</span>
      </v-col>
    </v-row>

    <v-row class="mt-2 align-baseline" dense>
      <v-col cols="6">
        <v-row class="align-baseline">
          <v-col cols="3" style="text-align: right;">
            <span class="text-h6">\(A_s = \)</span>
          </v-col>
          <v-col cols="9">
            <v-text-field v-model="A_s_i" label="阻带最小衰减" outlined dense></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <span class="text-h6">= {{ A_s_val }} dB</span>
      </v-col>
    </v-row>

    <v-btn color="primary" @click="solve_filter">Solve</v-btn>

    <h2 class="mb-2 mt-12">求解结果：</h2>

    <v-container class="pl-4">
      <v-row class="align-baseline" dense>
        <v-col cols="6">
          <v-row class="align-baseline">
            <v-col cols="3" style="text-align: right;">
              <span class="text-h6">\(N = \)</span>
            </v-col>
            <v-col cols="9">
              <span class="text-h6">{{ N }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="align-baseline mt-2" dense>
        <v-col cols="6">
          <v-row class="align-baseline">
            <v-col cols="3" style="text-align: right;">
              <span class="text-h6">\(f_c = \)</span>
            </v-col>
            <v-col cols="9">
              <span class="text-h6">{{ f_c_t }}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <span class="text-h6">= {{ f_c }} Hz</span>
        </v-col>
      </v-row>

      <!-- diagram -->
      <v-row class="align-center mt-2">
        <v-btn color="primary" icon @click="expand_figs = !expand_figs">
          <v-icon>{{ expand_figs ? "mdi-chevron-down" : "mdi-chevron-right" }}</v-icon>
        </v-btn>
        <h3>系统特性：</h3>
      </v-row>
      <v-expand-transition>
        <v-container v-show="expand_figs" fluid class="mt-2">
          <v-row class="mx-0">
            <v-col class="justify-center">
              <div style="width: 500px; height: 500px;">
                <LPFMagRes :order="N" :cutoff="w_c" :dc-gain="G_0_val"></LPFMagRes>
              </div>
            </v-col>
            <v-col class="justify-center">
              <div style="width: 500px; height: 500px;">
                <PoleZeroFig :poles="poles"></PoleZeroFig>
              </div>
            </v-col>
          </v-row>

          <v-row class="mx-0">
            <v-col class="justify-center">
              <div ref="pulse_fig_dom" style="width: 500px; height: 500px;"></div>
            </v-col>
            <v-col class="justify-center">
              <div ref="step_fig_dom" style="width: 500px; height: 500px;"></div>
            </v-col>
          </v-row>
        </v-container>
      </v-expand-transition>
    </v-container>
  </v-container>
</template>

<script>
import * as echarts from "echarts"
import * as mjs from "mathjs"
import { extend_scale_unit, encode_scale_unit } from "../dsp/parser"
import * as BTW from "../dsp/butterworth"
import * as fpck from "../dsp/fourier"


export default {
  name: "LPF",

  data: () => ({
    f_p_i: "1M",
    f_s_i: "1.5M",
    G_0_i: "0",
    A_p_i: "1",
    A_s_i: "15",

    N: 0,
    w_c: 0,
    f_c: 0,
    f_c_t: "0 Hz",

    expand_figs: true,
    poles: [],

    pulse_resp_chart: null,
    step_resp_chart: null
  }),

  computed: {
    f_p_val() { return extend_scale_unit(this.f_p_i) },
    f_s_val() { return extend_scale_unit(this.f_s_i) },
    G_0_val() { return extend_scale_unit(this.G_0_i) },
    A_p_val() { return extend_scale_unit(this.A_p_i) },
    A_s_val() { return extend_scale_unit(this.A_s_i) },
  },

  mounted() {
    const renderMath = () => {
      if (window.MathJax) {
        window.MathJax.typeset()
      } else {
        setTimeout(renderMath, 500)
      }
    }
    renderMath()

    // unit pulse response
    if (this.pulse_resp == null) {
      const pulse_opt = {
        title: { text: "Unit Pulse Response" },
        tooltip: { trigger: "none" },
        legend: { show: false },
        xAxis: { name: "t (s)", type: "value" },
        yAxis: { name: "h(t)", type: "value" },
        series: [{
          name: "s",
          type: "line",
          symbol: "none",
          smooth: true,
          data: []
        }]
      }
      this.pulse_resp_chart = echarts.init(this.$refs.pulse_fig_dom)
      this.pulse_resp_chart.setOption(pulse_opt)
    }

    /// unit step response
    if (this.step_resp_chart == null) {
      const step_opt = {
        title: { text: "Unit Step Response" },
        tooltip: { trigger: "none" },
        legend: { show: false },
        xAxis: { name: "t (s)", type: "value" },
        yAxis: { name: "h(t) * u(t)", type: "value" },
        series: [{
          name: "s",
          type: "line",
          symbol: "none",
          smooth: true,
          data: []
        }]
      }
      this.step_resp_chart = echarts.init(this.$refs.step_fig_dom)
      this.step_resp_chart.setOption(step_opt)
    }
  },

  methods: {
    solve_filter() {
      const data = BTW.pack_params(
        this.f_p_val * 2 * Math.PI,
        this.f_s_val * 2 * Math.PI,
        this.G_0_val,
        this.A_p_val,
        this.A_s_val
      )
      data.N = BTW.calc_n(data)
      data.w_c = BTW.calc_w_c(data)
      data.poles = BTW.calc_poles(data)

      this.N = data.N
      this.w_c = data.w_c
      this.f_c = this.w_c / 2 / Math.PI
      this.f_c_t = encode_scale_unit(this.f_c, 3)
      this.poles = []
      for (const rad of data.poles) {
        this.poles.push([1, rad / Math.PI * 180])
        console.log(rad)
      }

      const H = BTW.transfer_func(data)
      const t1 = (new Date()).getTime()
      const pulse_resp_data = fpck.IFT(H, 3, 60)
      console.log((new Date()).getTime() - t1)
      if (this.pulse_resp_chart) {
        this.pulse_resp_chart.setOption({ series: { data: pulse_resp_data } })
      }

      const step_resp_data = fpck.rsum(pulse_resp_data)
      if (this.step_resp_chart) {
        this.step_resp_chart.setOption({ series: { data: step_resp_data } })
      }
    } 
  },
}
</script>