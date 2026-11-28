
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
    const cookieName =
        process.env.AUTH_COOKIE_NAME || "medichannel_token";

    const backendUrl = process.env.BACKEND_API_URL;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(cookieName)?.value;

        if (backendUrl && token) {
            await fetch(`${backendUrl}/api/auth/logout`, {
                method: "POST",
                headers: {
                    Cookie: `${cookieName}=${token}`,
                },
                cache: "no-store",
            });
        }

        const response = NextResponse.json({
            message: "Logged out successfully",
        });

        response.cookies.set(cookieName, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;

    } catch (error) {
        console.error("Logout error:", error);

        const response = NextResponse.json(
            { message: "Logout failed" },
            { status: 500 }
        );

        response.cookies.set(cookieName, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    }
}
