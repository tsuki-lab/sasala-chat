import { NextRequest, NextResponse } from 'next/server'

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD

export const config = {
  matcher: ['/:path*'],
}

export function middleware(req: NextRequest) {
  if (!BASIC_AUTH_PASSWORD) {
    return NextResponse.next()
  }

  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === BASIC_AUTH_USER && pwd === BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/basic-auth'

  return NextResponse.rewrite(url)
}
