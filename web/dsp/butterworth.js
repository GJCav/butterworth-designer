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