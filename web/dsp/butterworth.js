import * as mjs from "mathjs"

export const pack_params = (w_p, w_s, G_0, A_p, A_s) => ({
  w_p, w_s, G_0, A_p, A_s
})

export const calc_n = (params) => {
  const { w_p, w_s, G_0, A_p, A_s } = params
  // const r = w_p / w_s
  const r = mjs.divide(w_p, w_s)
  // const A = Math.pow(10, (A_p - A_s) / 10)
  const A = mjs.pow(10, mjs.chain(A_p).subtract(A_s).divide(10).done())
  // const B = Math.pow(10, -(G_0 + A_s) / 10)
  const B = mjs.pow(10, mjs.chain(G_0).add(A_s).divide(10).multiply(-1).done())
  const C = (A - B) / (1 - B)
  const N = mjs.log(C) / mjs.log(r) / 2
  return mjs.ceil(N)
}

export const calc_w_c = (data) => {
  const { w_s, G_0, A_s, N } = data
  const A = mjs.pow(10, mjs.chain(G_0).add(A_s).divide(-10).done())
  const B = mjs.divide(A, 1 - A)
  const w_c = mjs.pow(B, 1 / (2 * N)) * w_s
  return w_c
}

export const calc_poles = (data) => {
  const { N } = data
  const poles = []
  for (let k = 1; k <= N; k++) {
    poles.push(((2 * k - 1) / (2 * N) + 1 / 2) * mjs.pi)
  }
  return poles
}

export const transfer_func = (data) => {
  const { G_0, w_c, poles } = data
  return (w) => {
    let v = mjs.chain(mjs.pow(10, G_0 / 20))
    const we = w / w_c
    for (const p of poles) {
      const A = mjs
        .chain(mjs.i).multiply(we)
        .subtract(
          mjs.exp(mjs.chain(mjs.i).multiply(p).done())
        ).done()
      v = v.multiply(mjs.divide(1, A))
    }
    return v.done()
  }
}

const calc_filter_1 = ({ M_0, w_c }) => {
  const R3 = 10000
  const R2 = (M_0 - 1) * R3
  const C1 = w_c > 1e9 ? 20e-15 : 1e-12
  const R1 = 1 / (w_c * C1)
  return { R1, R2, R3, C1 }
}

const calc_filter_2 = ({ M_0, w_c, A }) => {
  const k = M_0 - 1
  if (k === 0) {
    const C1 = 1e-12
    const C2 = C1 * (8 / (A * A))
    const sD = A / mjs.sqrt(2)
    const R1 = (A + sD) / (2 * C1 * w_c)
    const R2 = (A - sD) / (2 * C1 * w_c)
    const R3 = 10000
    const R4 = R3 * k
    return { R1, R2, R3, R4, C1, C2 }
  } else if (0 < k && k < 1) {
    const C1 = 1e-12
    const C2 = C1 * (8 / (A * A))
    const sD = A / mjs.sqrt(2)
    const R1 = (A - sD) / (2 * (1 - k) * w_c)
    const R2 = (A + sD) / (2 * C1 * w_c)
    const R3 = 10000
    const R4 = R3 * k
    return { R1, R2, R3, R4, C1, C2 }
  } else {
    const C1 = 10e-12
    const C2 = 10e-12
    const sD = mjs.sqrt(A * A + 4 * (k - 1))
    const R1 = (sD - A) / (2 * C1 * (k - 1) * w_c)
    const R2 = (sD + A) / (2 * C1 * w_c)
    const R3 = 10000
    const R4 = k * R3
    return { R1, R2, R3, R4, C1, C2 }
  }
}

export const calc_filter_param = (data) => {
  const { G_0, w_c, N } = data

  const params = []
  if (N % 2 === 0) {
    for (let r = 1; r <= N / 2; r++) {
      const M_0 = (r === 1) ? mjs.pow(10, G_0 / 20) : 1
      const A = 2 * mjs.sin((2 * r - 1) / (2 * N) * mjs.pi)
      const param = calc_filter_2({ M_0, w_c, A })
      params.push({ order: 2, ...param })
    }
  } else {
    const M_0 = mjs.pow(10, G_0 / 20)
    params.push({ order: 1, ...calc_filter_1({ M_0, w_c }) })
    for (let r = 1; r <= (N - 1) / 2; r++) {
      const A = 2 * mjs.sin((2 * r - 1) / (2 * N) * mjs.pi)
      const param = calc_filter_2({ M_0: 1, w_c, A })
      params.push({ order: 2, ...param })
    }
  }
  return params
}


export const inv_param = (param, w_c) => {
  if (param.order === 1) {
    const { R1, R2, R3, C1 } = param
    const M0 = 1 + R2 / R3
    const a = R1 * C1 * w_c
    return `${M0.toFixed(3)} / (1 + ${a.toFixed(3)})`
  } else {
    const { R1, R2, R3, R4, C1, C2 } = param
    const M0 = 1 + R4 / R3
    const a = w_c * C1 * R1 * w_c * C2 * R2
    const b = ((R1 + R2) * C1 - (R4 / R3) * C1 * R1) * w_c
    return `${M0.toFixed(2)} / (${a.toFixed(4)}s^2 + ${b.toFixed(4)}s + 1)`
  }
}