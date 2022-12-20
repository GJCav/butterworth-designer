<!-- eslint-disable vue/html-indent -->
<template>
  <v-container>
    <h1>设计文档</h1>

    <h2>Butterworth 低通滤波器</h2>
    <h3>概述</h3>
    <v-container fluid class="px-0">
      <p>Butterworth 滤波器（BTW）是指具有如下幅频特性曲线的滤波器，右图是对应的幅频特性曲线：</p>
      <v-row class="mx-0 align-center">
        <v-col cols="6">
          \[ |H(j \omega)|=\frac{1}{\sqrt{1+\left(\frac{\omega}{\omega_c}\right)^{2 N}}} \]
        </v-col>
        <v-col cols="6"><v-img src="/btw_mag.png" contain max-width="300px"></v-img></v-col>
      </v-row>
      <p>
        可以看到 Butterworth 滤波器具有两个参数：截止频率\( w_c \)、滤波器的阶\( N \)。
        设计一个 Butterworth 滤波器的过程就是计算这两个参数的过程。
      </p>
      <p>
        对于低通滤波器（LPF），有如下设计指标：通带频率\(f_p\)、阻带频率\(f_s\)、直流增益\(G_0\)、通带衰减\(A_p\)、阻带最小衰减\(A_s\)。
        因为 LPF 有直流增益，所以 BTW 的幅频响应公式修改为 
        \begin{equation} 
          |H(j \omega)|=\frac{M_0}{\sqrt{1+\left(\frac{\omega}{\omega_c}\right)^{2 N}}} \label{mag_eq}
        \end{equation}
        ，其中 \( M_0 = 10^{G_0 / 20} \)。
      </p>
      <p>将通带、阻带条件带入公式 \(\eqref{mag_eq}\)，得到如下方程：</p>
      <p>
        \begin{equation*}
          \begin{aligned}
          & \left|H\left(j w_p\right)\right|=\frac{10^{\frac{1}{20} G_0}}{\sqrt{1+\left(w_p / w_c\right)^{2 N}}}=10^{-\frac{1}{20} A_p} \\
          & \left.|H(j w_s\right) \mid=\frac{10^{\frac{1}{20} G_0}}{\sqrt{1+\left(w_s / w_c\right)^{2 N}}}=10^{-\frac{1}{20} A_s}
          \end{aligned}
        \end{equation*}
        其中，\(w = 2\pi f\)，这个方程的解为
      </p>
      <p>
        \begin{equation}
          \begin{aligned}
            N &= ln\left( \frac{10^{\frac{1}{10}\left(A_p-A_s\right)}-10^{-\frac{1}{10}\left(G_0+A_s\right)}}{1-10^{-\frac{1}{10}\left(G_0+A_s\right)}} \right)
                  / (2 ln(w_p/w_s)) \\
            w_c &= \left( \frac{10^{-\frac{1}{10}\left(G_0+A_s\right)}}{1-10^{-\frac{1}{10}\left(G_0+A_s\right)}} \right)^\frac{1}{2N}w_s
          \end{aligned}\label{lpf_n_w}
        \end{equation}
      </p>
      <p>
        现在我们已经通过 BTW 实现了目标 LPF，接下来考虑使用低通 Sallen-Key 滤波器（LPSKF）实现这个 BTW。LPSKF 结构及其传输函数如下：
      </p>
      <v-container fluid class="mx-0" style="padding: 0 1em 0 1em">
        <v-row class="mx-0">
          <v-col cols="8">
            <p>一阶 LPSKF：</p>
            <p>\begin{equation} H(s) = \frac{1+\frac{R_2}{R_3}}{1+sR_1C_1} \label{lpf_1}\end{equation}</p>
          </v-col>
          <v-col cols="4">
            <v-img src="/lpf_1.jpg" max-height="200px" contain></v-img>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="8" style="overflow-x: auto;">
            <p>二阶 LPSKF：</p>
            <p>
              \begin{equation} 
                H(s)=\frac{1+\frac{R_4}{R_3}}{1+s\left[\left(R_1+R_2\right) C_1-\frac{R_4}{R_3} R_1 C_2\right]+s^2 R_1 R_2 C_1 C_2}
                \label{lpf_2}
              \end{equation}
            </p>
          </v-col>
          <v-col cols="4">
            <v-img src="/lpf_2.jpg" max-height="200px" contain></v-img>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid class="mx-0">
        <p>将公式 \eqref{mag_eq} 展开为传输函数形式如下：</p>
        <p style="font-size:1.1em">
          \begin{align}
            H(s) &= \frac{w_c^N}{\prod_{k=1}^{N} (s-p_k)} \label{btw_h_pole}\\
                &= \begin{cases}
                      \frac{\omega_c^N}{\prod_{k=1}^{N / 2}\left[s^2+2 s \omega_c \sin \left(\frac{2 k-1}{2 N} \pi\right)+\omega_c^2\right]} & N\ is\ even \\
                      \frac{\omega_c^N}{\left(s+\omega_c\right) \prod_{k=1}^{(N-1) / 2}\left[s^2+2 s \omega_c \sin \left(\frac{2 k-1}{2 N} \pi\right)+\omega_c^2\right]} & N\ is\ odd
                    \end{cases} \label{btw_h_decomp}
          \end{align}
        </p>
        <p>
          其中：\( p_k = w_c e^{j(\frac{2k-1}{2N}+\frac{1}{2})\pi} \)。
          公式 \eqref{btw_h_pole} 展现出 BTW 的极点位置，公式 \eqref{btw_h_decomp} 将高阶的 BTW 分解为一系列一阶、二阶滤波器的级联，
          与\eqref{lpf_1}\eqref{lpf_2} 对应。现在可以开始设计 LPSKF 中电阻、电容的值。
        </p>
      </v-container> 
    </v-container>

    <h3>一阶 LPSKF 设计</h3>
    <v-container fluid class="px-0">
      <p>
        对于一阶 LPSKF，方程联立如下：
        \begin{equation}
          \left\{ \begin{aligned}
            1 + \frac{R_2}{R_3} &= M_0 \\
            R_1C_1 &= \frac{1}{w_c}
          \end{aligned}\right.
        \end{equation}
        解得：
        \begin{equation}
            R_2 = (M_0 - 1) R_3 \qquad
            R_1 = \frac{1}{w_c C_1}
        \end{equation}
        仍然遗留\(R_3、C_1\)两个自由变量，这里取 \(R_3 = 10k\Omega \)；
        \(w_c\) 在 MHz 量级时取\(C_1 = 1pF\)，在 GHz 量级时取 \( C_1 = 20fF \)，这样 \(R_1\) 能位于 \(k\Omega\)量级。
      </p>
    </v-container>

    <h3>二阶 LPSKF 设计</h3>
    <v-container fluid class="px-0">
      <p>
        对于二阶 LPSKF，方程联立如下：
        \begin{equation}
          \left\{\begin{aligned}
            1+k &= M_0 \\
            \left(R_1+R_2\right) C_1-\frac{R_4}{R_3} R_1 C_1 &= \frac{A_r}{w_c} \\
            R_1R_2C_1C_2 &= \frac{1}{w_c^2}
          \end{aligned}\right.
        \end{equation}
        其中，
        \begin{aligned}
          A_r &= 2\sin\left(\frac{2r-1}{2N}\pi\right) \\ 
          k &= \frac{R_4}{R_3} = M_0 - 1
        \end{aligned}
      </p>
      <p>
        这个方程的解比较复杂，为了缩短公式，先定义一个辅助量：
        \[ \Delta = \frac{A^2C_2+4(k-1)C_1}{C_2} \]
      </p>
      <p>
        ① 当 \(k = 0\) 时，方程的解为：
        \begin{equation}
          R_1 = \frac{A+\sqrt{\Delta}}{2C_1w_c} \qquad
          R_2 = \frac{A-\sqrt{\Delta}}{2C_1w_c}
        \end{equation}
        要使这个解具有物理意义，还需保证：\(\frac{C_2}{C_1} > \frac{4}{A^2}\)。综合上述信息，可取：
        \begin{equation}
          C_1 = 1pF \qquad
          C_2 = \frac{8}{A^2}
        \end{equation}
      </p>
      <p>
        ② 当 \(k \in (0, 1) \) 时，方程有两组解：
        \begin{align}
          & R_1=\frac{A+\sqrt{\Delta}}{2 C_1(1-k) w_c} \qquad R_2=\frac{A-\sqrt{\Delta}}{2 C_1 w_c} \\
          & R_1=\frac{A-\sqrt{\Delta}}{2 C_1(1-k) w_c} \qquad R_2=\frac{A+\sqrt{\Delta}}{2 C_1 w_c} \label{lpf_2_sol2}
        \end{align}
        选择其中第二组解 \eqref{lpf_2_sol2}，同 ① 带入：
        \begin{equation}
          C_1 = 1pF \qquad
          C_2 = \frac{8}{A^2}
        \end{equation}
      </p>
      <p>
        ③ 当 \(k > 1\) 时，方程的解为：
        \begin{equation}
          R_1=\frac{\sqrt{\Delta}-A}{2 C_1(k-1) w_c} \qquad R_2=\frac{\sqrt{\Delta}+A}{2 C_1 w_c}
        \end{equation}
        两个电容的值取为：
        \begin{equation}
          C_1 = C_2 = 10pF
        \end{equation}
      </p>
      <p>经过验证，上面的几种电容取值虽然不是最优的，但能保证计算出的电容、电阻值在比较合理的范围内。</p>
    </v-container>

    <h2>Butterworth 高通滤波器</h2>
    <v-container fluid class="mx-0">
      <p>
        要设计高通 Butterworth 滤波器（HPBTW）可复用 LPBTW 的设计过程。假设目标 HPBTW 传输函数为 \( H_h(j\omega) \)，
        利用变换\(\omega \cdot \omega' = -\omega_r^2 \) 可将 \(H_h(j\omega)\) 映射为 \( H_l(j\omega') \)，
        而 \( H_l \) 对应一个 LPF。使用 LPBTW 相关内容可求解出 \(H_l(s')\) 和 LPF 相关电路参数，再通过一些变换即可得到
        HPF 相关电路参数。
      </p>
      <p>
        上面的映射过程需要确定 \(w_r\) 的值，一般直接令 \(w_r = w_c\)，带入阻带频率、通带频率等条件后，解得：
        \begin{equation}
          \begin{aligned}
            N &= ln\left( \frac{10^{\frac{1}{10}\left(A_p-A_s\right)}-10^{-\frac{1}{10}\left(G_0+A_s\right)}}{1-10^{-\frac{1}{10}\left(G_0+A_s\right)}} \right)
                  / (2 ln(w_s/w_p)) \\
            w_c &= w_s\left[10^{\frac{1}{10}\left(G_0+A_s\right)}-1\right]^{\frac{1}{2 N}}
          \end{aligned}
        \end{equation}
        注意上述公式和公式\eqref{lpf_n_w} 的区别。
      </p>
      <p>Sallen-Key 滤波器工作在高通模式时（HPSKF），结构如下：</p>
      <v-container fluid class="mx-0" style="padding: 0 0em 0 0em">
        <v-row class="mx-0">
          <v-col cols="8">
            <p>一阶 HPSKF：</p>
            <p>\begin{equation} H(s) = \frac{1+\frac{R_2}{R_3}}{1+\frac{1}{R_1 C_1} \cdot \frac{1}{s}} \label{hpf_1}\end{equation}</p>
          </v-col>
          <v-col cols="4">
            <v-img src="/hpf_1.jpg" max-height="200px" contain></v-img>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="8">
            <p>二阶 HPSKF：</p>
            <p>
              \begin{equation} 
                H(s)=\frac{1+\frac{R_4}{R_3}}{1+\frac{1}{s} \cdot\left[\left(\frac{1}{C_1}+\frac{1}{C_2}\right) \frac{1}{R_1}-\frac{R_4}{R_3} \frac{1}{R_2 C_1}\right]+\frac{1}{s^2} \cdot \frac{1}{R_1 R_2 C_1 C_2}}
                \label{hpf_2}
              \end{equation}
            </p>
          </v-col>
          <v-col cols="4">
            <v-img src="/hpf_2.jpg" max-height="200px" contain></v-img>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid class="mx-0 mt-2">
        <p>
          对于一阶滤波器，将公式\eqref{hpf_1}与\eqref{lpf_1}对比，不难得到如下转换关系：
          \begin{equation}\begin{aligned}
            C_1 = \frac{1}{R_1'} \qquad & R_1 = \frac{1}{C_1' w_c} \\
            R_2 = R_2' \qquad & R_3 = R_3'
          \end{aligned}\end{equation}
          其中有一撇的符号表示使用 LPBTW 求解过程得到的解。
        </p>
        <p>
          对于二阶滤波器，将公式\eqref{hpf_2}与\eqref{lpf_2}对比，同理可得：
          \begin{equation}\begin{array}{rll}
            C_1 &= \frac{1}{R_1'} \qquad & C_2 = \frac{1}{R_2'} \\
            R_1 &= \frac{1}{C_1' w_c} \qquad & R_2 = \frac{1}{C_2' w_c} \\
            R_3 &= R_3' \qquad & R_4 = R_4'
          \end{array}\end{equation}
        </p>
      </v-container>
    </v-container>

    <h2>单位冲激、阶跃响应</h2>
    <v-container fluid class="mx-0">
      <p>
        因为 BTW 的传输阶数很高，很难计算出单位冲激响应、单位阶跃响应的表达式，
        所以这里采用数值计算的方法求解单位冲激响应和单位阶跃响应。
      </p>
      <p>
        单位阶跃响应 \( h(t) = \mathcal{F}^{-1} \{H(jw)\}\)，再利用 \( h(t) \in \mathbb{R} \)，有如下公式：
        \begin{equation}
          h(t)=\frac{1}{\pi} \int_0^{\infty} \operatorname{Re}\left\{H(j w) e^{j \omega t}\right\} d w
        \end{equation}
      </p>
      <p>
        单位阶跃响应 \( U(t) = h(t) * u(t) = \int_{-\infty}^t h(\tau) d\tau \)。
      </p>
      <p>
        受限于Javascript语言的孱弱的计算性能，数值积分时采样点不能过于密集，可想而知上面个两个公式的计算误差会非常非常大。
        若需要得到比较精确的响应曲线，还是需要使用 Matlab、Mathematica 等专业的计算软件，
        但经过测试，Mathematica 也无法很难准确画出 \( N=6, f_c = 1.13 MHz\) 时的单位冲激、单位阶跃响应，绘制的曲线有阶跃、有断点，
        MMA 也不能很好的算出这个响应。
      </p>
    </v-container>

    <!-- pad bottom -->
    <div style="height:300px"></div>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',

  mounted() {
    const renderMath = () => {
      if (window.MathJax) {
        window.MathJax.texReset()
        window.MathJax.typeset()
      } else {
        setTimeout(renderMath, 500)
      }
    }
    renderMath()
  },

  methods: {
    
  },
}
</script>

<style scoped>
p {
  text-indent: 2em;
  line-height: 1.5em;
  font-size: 1.1em;
}
</style>