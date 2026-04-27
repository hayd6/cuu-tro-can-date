"use client";

import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      initialized.current = true;
      
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      
      if (appId) {
        OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/" },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          notifyButton: {
            enable: true,
            position: 'bottom-left',
            size: 'medium',
            prenotify: false,
            showCredit: false,
            text: {},
          } as any,
        }).then(() => {
          console.log("OneSignal initialized successfully");
        }).catch((err) => {
          console.error("OneSignal initialization error:", err);
        });
      } else {
        console.warn("OneSignal App ID missing in environment variables");
      }
    }
  }, []);

  return null;
}
