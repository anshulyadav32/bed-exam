import { NextResponse } from "next/server";

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
    let body;
    try { body = await request.json(); } catch { body = {}; }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !isValidEmail(email) || !subject || message.length < 10) {
        return NextResponse.json(
            { message: "Name, valid email, subject, and a message of at least 10 characters are required" },
            { status: 400 }
        );
    }

    console.log("[contact]", JSON.stringify({ name, email, subject, message, receivedAt: new Date().toISOString() }));
    return NextResponse.json({ message: "Message sent. We will get back to you soon." }, { status: 201 });
}
