import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie');
  const backendUrl = process.env.API_INTERNAL_URL;

  if (!backendUrl) {
    return NextResponse.json({ error: 'API_INTERNAL_URL missing' }, { status: 500 });
  }

  const res = await fetch(`${backendUrl}/auth/me`, {
    headers: {
      cookie: cookie ?? ''
    },
    cache: 'no-store'
  });

  const data = await res.json();
  return NextResponse.json(data);
}
