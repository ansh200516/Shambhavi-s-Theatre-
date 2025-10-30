import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export function getUserIdFromRequest(request: NextRequest): number | null {
  const auth = request.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return null

  try {
    const token = auth.slice(7)
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; username: string; email: string }
    return payload.id
  } catch {
    return null
  }
}
