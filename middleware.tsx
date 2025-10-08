import { NextResponse, NextRequest } from "next/server";
const Middleware = (req: NextRequest) => {
  if (req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = req.nextUrl.pathname.toLowerCase();
  return NextResponse.redirect(url);
};
export default Middleware;
