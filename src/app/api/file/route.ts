import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  const BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_RETRIVE_URL;
  return NextResponse.redirect(BASE_URL + "/" + path);
}