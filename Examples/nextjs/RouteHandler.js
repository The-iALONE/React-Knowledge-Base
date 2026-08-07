// Examples/nextjs/RouteHandler.js
// مستندات: Nextjs/Route-Handlers.md

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", cabins: [] });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ created: body }, { status: 201 });
}
