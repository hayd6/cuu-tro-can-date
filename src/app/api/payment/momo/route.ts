import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { amount, orderInfo } = await request.json();

    const partnerCode = process.env.MOMO_PARTNER_CODE!;
    const accessKey = process.env.MOMO_ACCESS_KEY!;
    const secretKey = process.env.MOMO_SECRET_KEY!;
    const endpoint = process.env.MOMO_ENDPOINT!;
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/orders`;
    const ipnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/momo/callback`;
    const requestType = "captureWallet"; // Or "createOrder" depending on MoMo version, captureWallet is common for sandbox
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const extraData = ""; // empty string if not used
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";

    // Create signature raw string
    // accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    // Generate HMAC SHA256 signature
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Construct request body
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang,
    };

    // Post to MoMo endpoint
    const momoResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await momoResponse.json();

    if (result && result.payUrl) {
      return NextResponse.json({ payUrl: result.payUrl });
    } else {
      console.error("MoMo Error Response:", result);
      return NextResponse.json(
        { error: result.message || "Failed to create MoMo payment" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
