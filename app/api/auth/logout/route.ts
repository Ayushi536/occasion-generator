import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set({
    name: 'wishly_token',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
    path: '/',
  });
  return response;
}
