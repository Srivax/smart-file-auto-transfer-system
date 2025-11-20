export const logClientError = (message, details = {}) => {
  const entry = {
    message,
    details,
    time: new Date().toISOString(),
    ua: navigator.userAgent
  }
  console.table(entry)
}
