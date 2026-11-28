
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const body = await request.json();

        const backendUrl = process.env.BACKEND_API_URL;
        const cookieName =
            process.env.AUTH_COOKIE_NAME || "medichannel_token";

        if (!backendUrl) {
            return NextResponse.json(
                { message: "Backend API URL is not configured" },
                { status: 500 }
            );
        }

        // Send login details to Spring Boot.
        const backendResponse = await fetch(
            `${backendUrl}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
                cache: "no-store"
            }
        );

        const data = await backendResponse.json().catch(() => ({}));

        if (!backendResponse.ok) {
            return NextResponse.json(
                { message: data.message || "Invalid email or password" },
                { status: backendResponse.status }
            );
        }

        // Read the JWT cookie returned by Spring Boot.
        const setCookie = backendResponse.headers.get("set-cookie");

        const cookiePattern = new RegExp(
            `(?:^|,\\s*)${cookieName}=([^;]*)`
        );

        const match = setCookie?.match(cookiePattern);

        if (!match) {
            return NextResponse.json(
                { message: "Authentication token was not received" },
                { status: 502 }
            );
        }

        const token = match[1];

        // Return the user details and set the cookie on Next.js.
        const response = NextResponse.json(data);

        response.cookies.set(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge:
                Number(process.env.JWT_EXPIRATION_MINUTES || 30) * 60
        });

        return response;

    } catch (error) {
        console.error("Login route error:", error.message);

        return NextResponse.json(
            { message: "Unable to process login request" },
            { status: 500 }
        );
    }
}
