export const generateRandomCode = (baselength: number) => {
  let id = ''
  while (id.length < baselength) {
    id += Math.random().toString(36).slice(2)
  }
  return id.slice(0, baselength)
}
