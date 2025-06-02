import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get('error')

  // Handle different error types
  let errorMessage = 'An unknown error occurred'
  if (error === 'Signin') {
    errorMessage = 'Try signing in with a different account.'
  } else if (error === 'OAuthSignin') {
    errorMessage = 'Error in the OAuth signin process.'
  } else if (error === 'OAuthCallback') {
    errorMessage = 'Error in the OAuth callback process.'
  } else if (error === 'OAuthCreateAccount') {
    errorMessage = 'Error creating OAuth account.'
  } else if (error === 'EmailCreateAccount') {
    errorMessage = 'Error creating email account.'
  } else if (error === 'Callback') {
    errorMessage = 'Error in the OAuth callback.'
  } else if (error === 'OAuthAccountNotLinked') {
    errorMessage = 'Email on the account not linked, try a different provider.'
  } else if (error === 'EmailSignin') {
    errorMessage = 'The email signin link is invalid or has expired.'
  } else if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid credentials.'
  } else if (error === 'SessionRequired') {
    errorMessage = 'Please sign in to access this page.'
  }

  return NextResponse.json({ error: errorMessage }, { status: 400 })
}
