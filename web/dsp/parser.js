const scale_unit = {
  k: 1000,
  K: 1000,
  M: 1e6,
  G: 1e9
}

export const extend_scale_unit = (s) => {
  let v = Number.parseFloat(s)
  if (s[s.length - 1] in scale_unit) {
    v *= scale_unit[s[s.length - 1]]
  }
  return v
}

export const encode_scale_unit = (n, precision = -1) => {
  let c = ""
  if (n >= 1e9) { c = "G" }
  else if (n >= 1e6) { c = "M" }
  else if (n >= 1e3) { c = "K" }
  else { c = "" }

  if (c in scale_unit) {
    n /= scale_unit[c]
  }

  if (precision >= 0) {
    n = n.toPrecision(precision)
  }

  return n + c
}