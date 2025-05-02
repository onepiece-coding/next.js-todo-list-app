// Middleware to protect API and Pages

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * the Next.js middleware runs on the Edge Runtime, and the jsonwebtoken uses the Node.js crypto, which doesn't live in Edge.
 * The jose library is used on Edge because it uses the WebCrypto API.
 * The TextEncoder interface takes a stream of code points as input and emits a stream of UTF-8 bytes (WebCrypto-compatible).
 *
 */

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Pages Protect
  if (pathname.startsWith("/tasks")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
  }

  // API Routes Protect
  if (pathname.startsWith("/api/tasks")) {
    if (!token)
      return NextResponse.json(
        {
          error: "No token provided, access denied!",
        },
        { status: 401 }
      );
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      console.log(decoded);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.userId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          error: "Invalid token, access denied!",
        },
        { status: 401 }
      );
    }
  }
}

// Determine which paths the middleware applies to
export const config = { matcher: ["/api/tasks/:path*", "/tasks/:path*"] };
