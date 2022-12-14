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

    <v-btn @click="solve_filter">Solve</v-btn>
  </v-container>
</template>

<script>
import { extend_scale_unit } from "../dsp/parser"
import * as BTW from "../dsp/butterworth"

export default {
  name: "LPF",

  data: () => ({
    f_p_i: "1M",
    f_s_i: "1.5M",
    G_0_i: "0",
    A_p_i: "1",
    A_s_i: "15"
  }),

  computed: {
    f_p_val() { return extend_scale_unit(this.f_p_i) },
    f_s_val() { return extend_scale_unit(this.f_s_i) },
    G_0_val() { return extend_scale_unit(this.G_0_i) },
    A_p_val() { return extend_scale_unit(this.A_p_i) },
    A_s_val() { return extend_scale_unit(this.A_s_i) },
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
      console.log(data.N)
      data.w_c = BTW.calc_w_c(data)
      console.log(data.w_c / Math.PI / 2)
      data.poles = BTW.calc_poles(data)
      for (const p of data.poles) {
        console.log(p / Math.PI)
      }
    }
  },
}
</script>