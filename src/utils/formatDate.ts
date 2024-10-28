import { Timestamp } from "@react-native-firebase/firestore"

export const formatDate = (dateTimestamp: Timestamp) => {
  if (!dateTimestamp) return 'No disponible'
  const date = dateTimestamp.toDate()
  const day = String(date.getDate() + 1).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const formatHourMinutes = (dateTimestamp: Timestamp) => {
  if (!dateTimestamp) return 'No disponible'
  const date = dateTimestamp.toDate()
  const hours = String(date.getHours() + 1).padStart(2, '0')
  const minutes = String(date.getMinutes() + 1).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatSeconds = (dateTimestamp: Timestamp) => {
  if (!dateTimestamp) return 'No disponible'
  const date = dateTimestamp.toDate()
  const seconds = String(date.getSeconds() + 1).padStart(2, '0')
  return seconds
}

export const formatDateHour = (dateTimestamp: Timestamp) => {
  if (!dateTimestamp) return 'No disponible'
  const date = formatDate(dateTimestamp)
  const hourMinutes = formatHourMinutes(dateTimestamp)
  return `${date} ${hourMinutes}`
}

 export const formatDateHourSeconds = (dateTimestamp: Timestamp) => {
  if (!dateTimestamp) return 'No disponible'
  const dateHourMinutes = formatDateHour(dateTimestamp)
  const seconds = formatSeconds(dateTimestamp)
  return `${dateHourMinutes}:${seconds}`
}
