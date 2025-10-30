import { NextRequest, NextResponse } from 'next/server'
import { getDbPool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const pool = getDbPool()
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username])

    if (!rows.length) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const user = rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ ok: true, username: user.username, token })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
