import * as mjs from "mathjs"

/**
 * assume that lim_inf f = 0
 * @param  f 
 * @returns 
 */
export const integral = (f, l, r, N = 1000) => {
  let val = 0
  const step = (r - l) / N
  for (let i = 0; i < N; i++) {
    const x = l + step * i
    const nx = x + step
    const v1 = f(x)
    const v2 = f(nx)
    val += (v1 + v2) / 2 * step
  }
  return val
}


export const IFT = (X, end_time, N = 100) => {
  const t_step = end_time / N
  const points = []
  for (let i = 0; i < N; i++) {
    const t = t_step * i
    const f = (w) => {
      const b = mjs.exp(mjs.chain(mjs.i).multiply(w * t).done())
      return mjs.re(mjs.multiply(X(w), b))
    }
    points.push([t, integral(f, 0, 1000) / Math.PI])
  }
  return points
}


/**
 * running sum on h(t)
 * @param {*} h 
 */
export const rsum = (h) => {
  const points = [[0, 0]]
  let sum = 0
  for (let i = 1; i < h.length; i++) {
    const [t1, v1] = h[i - 1]
    const [t2, v2] = h[i]
    const v = (v1 + v2) * (t2 - t1) / 2
    sum += v
    points.push([t2, sum])
  }
  return points
}