
export function convertMicroToDate(microTime) {
  return new Date(new Date(microTime).getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '')     // delete the dot and everything after
}