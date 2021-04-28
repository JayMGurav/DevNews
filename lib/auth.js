import jwt from "jsonwebtoken";
import {  MAX_AGE, setTokenCookie,getTokenCookie } from './authCookies'


export function setLoginSession(res, token) {
  // const createdAt = Date.now()
  // Create a session object with a max age that we can validate later
  // const obj = { ...session, createdAt, maxAge: MAX_AGE }
  // const token = jwt.sign(obj, process.env.JWT_SECRET)

  setTokenCookie(res, token)
}


export function getLoginSession(req) {
  const token = getTokenCookie(req)

  if (!token) return

  const session = jwt.verify(token, process.env.JWT_SECRET)
  const expiresAt = session.createdAt + session.maxAge

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired')
  }

  return session
}