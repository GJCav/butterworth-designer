<template>
  <v-container>
    <h1>Design Params:</h1>
    <v-row class="mt-2 align-baseline" dense>
      <v-col cols="6">
        <v-row class="align-baseline">
          <v-col cols="3" style="text-align: right;">
            <span class="text-h6">\(w_p = \)</span>
          </v-col>
          <v-col cols="9">
            <v-text-field v-model="w_p_i" label="通带频率" outlined dense></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <span class="text-h6">= {{ w_p_val }} Hz</span>
      </v-col>
    </v-row>

    <v-row class="mt-2 align-baseline" dense>
      <v-col cols="6">
        <v-row class="align-baseline">
          <v-col cols="3" style="text-align: right;">
            <span class="text-h6">\(w_s = \)</span>
          </v-col>
          <v-col cols="9">
            <v-text-field v-model="w_s_i" label="阻带频率" outlined dense></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <span class="text-h6">= {{ w_s_val }} Hz</span>
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
  </v-container>
</template>

<script>
import { extend_scale_unit } from "../dsp/parser"

export default {
  name: "LPF",

  data: () => ({
    w_p_i: "10M",
    w_s_i: "20M",
    G_0_i: "1",
    A_p_i: "1",
    A_s_i: "100"
  }),

  computed: {
    w_p_val() { return extend_scale_unit(this.w_p_i) },
    w_s_val() { return extend_scale_unit(this.w_s_i) },
    G_0_val() { return extend_scale_unit(this.G_0_i) },
    A_p_val() { return extend_scale_unit(this.A_p_i) },
    A_s_val() { return extend_scale_unit(this.A_s_i) },
  }
}
</script>