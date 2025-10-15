import { Client, Environment } from 'square'

export function getSquareClient() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const environment = process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox

  if (!accessToken) {
    throw new Error('Square access token not configured')
  }

  return new Client({
    accessToken,
    environment,
  })
}

export function getSquareLocationId(): string {
  const locationId = process.env.SQUARE_LOCATION_ID
  if (!locationId) {
    throw new Error('Square location ID not configured')
  }
  return locationId
}

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || ''
