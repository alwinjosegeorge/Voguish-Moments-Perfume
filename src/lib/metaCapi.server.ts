import crypto from "crypto";

function hashSha256(val: string | undefined | null): string | null {
  if (!val) return null;
  return crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex");
}

export async function sendMetaCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    contents?: Array<{ id: string; quantity: number; price?: number }>;
    content_type?: string;
  };
}) {
  const pixelId = process.env.VITE_META_PIXEL_ID || process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("[Meta CAPI] Skipping event transmission: VITE_META_PIXEL_ID or META_ACCESS_TOKEN not configured.");
    return;
  }

  // Normalize and hash user data
  const payloadUserData: Record<string, any> = {};

  if (userData.email) {
    payloadUserData.em = [hashSha256(userData.email)];
  }
  if (userData.phone) {
    // Meta expects phone numbers to contain country code, e.g. "919876543210".
    // We normalize the phone: remove non-digits, and pre-pend '91' if it's a 10-digit number.
    let phoneNum = userData.phone.replace(/\D/g, "");
    if (phoneNum.length === 10) {
      phoneNum = "91" + phoneNum;
    }
    payloadUserData.ph = [hashSha256(phoneNum)];
  }
  if (userData.firstName) {
    payloadUserData.fn = [hashSha256(userData.firstName)];
  }
  if (userData.lastName) {
    payloadUserData.ln = [hashSha256(userData.lastName)];
  }
  if (userData.clientIpAddress) {
    payloadUserData.client_ip_address = userData.clientIpAddress;
  }
  if (userData.clientUserAgent) {
    payloadUserData.client_user_agent = userData.clientUserAgent;
  }
  if (userData.fbp) {
    payloadUserData.fbp = userData.fbp;
  }
  if (userData.fbc) {
    payloadUserData.fbc = userData.fbc;
  }

  const eventPayload = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl || "https://voguishmoments.com/",
    action_source: "website",
    user_data: payloadUserData,
    custom_data: customData,
  };

  try {
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [eventPayload],
        access_token: accessToken,
      }),
    });

    const resJson = await response.json();
    if (!response.ok) {
      console.error("[Meta CAPI] Error sending event to Meta API:", JSON.stringify(resJson));
    } else {
      console.log(`[Meta CAPI] Event '${eventName}' sent successfully. Event ID: ${eventId}, Trace ID:`, resJson.fb_trace_id);
    }
  } catch (error) {
    console.error("[Meta CAPI] Network error while sending event:", error);
  }
}
