import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { path = "/", referrer = "Direct / Unknown" } = body;

    // Detect Geolocation (Vercel provides native geo headers)
    const city = req.headers.get("x-vercel-ip-city") || "Unknown City";
    const country = req.headers.get("x-vercel-ip-country") || "Unknown Country";
    const region = req.headers.get("x-vercel-ip-country-region") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    // Detect device type from user-agent
    const isMobile = /mobile/i.test(userAgent);
    const isApple = /iPhone|iPad|Macintosh/i.test(userAgent);
    const isWindows = /Windows/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const deviceType = isMobile
      ? isApple
        ? "📱 Apple iPhone"
        : isAndroid
        ? "📱 Android Phone"
        : "📱 Mobile Device"
      : isApple
      ? "💻 Apple Mac"
      : isWindows
      ? "💻 Windows PC"
      : "💻 Desktop";

    // Clean source / referrer
    let cleanSource = referrer;
    if (referrer.includes("linkedin.com")) cleanSource = "💼 LinkedIn (Direct Lead)";
    else if (referrer.includes("google.com")) cleanSource = "🔍 Google Search";
    else if (referrer.includes("whatsapp.com") || referrer.includes("whatsapp")) cleanSource = "💬 WhatsApp";
    else if (!referrer || referrer === "Direct / Unknown") cleanSource = "🔗 Direct Link / Social";

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    // Format Alert Message
    const alertMessage = 
`🚨 *NEW VISITOR DETECTED!*
━━━━━━━━━━━━━━━━━━━
📍 *Location:* ${city}, ${region ? region + ", " : ""}${country}
💼 *Source:* ${cleanSource}
📄 *Page:* \`${path}\`
💻 *Device:* ${deviceType}
🕒 *Time (IST):* ${timestamp}
🌐 *IP:* \`${ip}\`
━━━━━━━━━━━━━━━━━━━
🔗 [Open Live Studio](https://salesforce-developer-lab.vercel.app/studio)`;

    // 1. Send Telegram Notification (if configured)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: alertMessage,
          parse_mode: "Markdown",
        }),
      }).catch((e) => console.error("Telegram send error:", e));
    }

    // 2. Email / Webhook Notification (if configured)
    const emailWebhook = process.env.NOTIFICATION_WEBHOOK_URL;
    if (emailWebhook) {
      await fetch(emailWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: alertMessage,
          to: "umendrabhati2001@gmail.com",
          subject: `🚨 Salesforce Lab Visitor: ${city}, ${country}`,
        }),
      }).catch((e) => console.error("Webhook send error:", e));
    }

    return NextResponse.json({ ok: true, location: { city, country } });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
