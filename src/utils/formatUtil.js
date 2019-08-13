import * as R from 'ramda'

export const textToHtml = str => {
  if (!str) {
    return str
  }
  const addLineBreak = R.pipe(
    R.split('\n'),
    R.join('<br />')
  )
  const linkifier = str => {
    const matches = str.match(/https?:\/\/[^\s<]*/g)
    if (!matches) return str
    return R.pipe(
      ...matches.map(url => R.replace(url, `<a href="${url}">${url}</a>`))
    )(str)
  }
  return R.pipe(
    // addP,
    addLineBreak,
    linkifier
  )(str)
}
