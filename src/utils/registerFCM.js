// src/utils/registerFCM.js
import { messaging, getToken, onMessage } from "../firebase";

const VAPID_KEY = "BCZepWDtYcW12x9Inm3B-wkLuNPikIL8ouqTkfYI1BTjlHbv-pqhD-lKzXmKfXAdfYuGxsAqeVbPk31DfCBU16Q";

export const registerFCM = async (API_URL) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("🚫 Notification permission denied");
      return;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log("📱 FCM token:", token);

      await fetch(`${API_URL}/api/push/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } else {
      console.warn("❌ No FCM token retrieved");
    }

    // Foreground message handling
    onMessage(messaging, (payload) => {
      console.log("🟡 Message received in foreground:", payload);
      alert(`${payload.notification?.title}\n${payload.notification?.body}`);
    });

  } catch (err) {
    console.error("🔥 FCM registration failed:", err.message);
  }
};
