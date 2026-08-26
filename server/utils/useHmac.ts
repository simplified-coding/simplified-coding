import crypto from "crypto";

export default function(value: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(value).digest("hex")
}