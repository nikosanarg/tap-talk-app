export const formatDate = (dateString: string) => {
  if (!dateString) return 'No disponible'
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const formatHourMinutes = (dateString: string) => {
  if (!dateString) return 'No disponible'
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatSeconds = (dateString: string) => {
  if (!dateString) return 'No disponible'
  const date = new Date(dateString)
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return seconds
}

export const formatDateHour = (dateString: string) => {
  if (!dateString) return 'No disponible'
  const date = formatDate(dateString)
  const hourMinutes = formatHourMinutes(dateString)
  return `${date} ${hourMinutes}`
}

export const formatDateHourSeconds = (dateString: string) => {
  if (!dateString) return 'No disponible'
  const dateHourMinutes = formatDateHour(dateString)
  const seconds = formatSeconds(dateString)
  return `${dateHourMinutes}:${seconds}`
}
