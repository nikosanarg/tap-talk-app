export const generateRandomCode = () => {
  let id = ''
  while (id.length < 16) {
    id += Math.random().toString(36).slice(2)
  }
  return id.slice(0, 16)
}