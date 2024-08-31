import { formatDate } from "../src/utils/formatDate"
import { formatSinceTimeToHumanRead } from "../src/utils/formatHour"
import { generateRandomCode } from "../src/utils/generateRandomCode"
import { validateEmail } from "../src/utils/validateEmail"

describe('formatSinceTimeToHumanRead', () => {
  it('Retorna un mensaje human-readable para distintas diferencias horarias', () => {
    const now = Date.now()
    expect(formatSinceTimeToHumanRead(now - 60 * 1000)).toBe('hace 1 minuto')
    expect(formatSinceTimeToHumanRead(now - 45 * 60 * 1000)).toBe('hace 45 minutos')
    expect(formatSinceTimeToHumanRead(now - 75 * 60 * 1000)).toBe('hace 1 hora')
    expect(formatSinceTimeToHumanRead(now - 3 * 60 * 60 * 1000)).toBe('hace 3 horas')
  })
})

describe('formatDate', () => {
  it('Formatea una fecha a DD/MM/AAAA', () => {
    const date = new Date('2024-11-28')
    const formattedDate = formatDate(date)
    expect(formattedDate).toBe('28/11/2024')
  })

  it('Formatea una fecha a DD/MM/AAAA rellenando con ceros días y meses', () => {
    const date = new Date('2024-02-05')
    const formattedDate = formatDate(date)
    expect(formattedDate).toBe('05/02/2024')
  })
})

describe('generateRandomId', () => {
  it('Genera códigos aleatorios y unívocos', () => {
    const id = generateRandomCode()
    expect(id).toHaveLength(16)
    const id2 = generateRandomCode()
    expect(id).not.toBe(id2)
  })
})

describe('isValidEmail', () => {
  it('Valida que el mail ingresado tenga un formato correcto', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('testexample.com')).toBe(false)
    expect(validateEmail('test@.com')).toBe(false)
    expect(validateEmail('test@example')).toBe(false)
  })
})