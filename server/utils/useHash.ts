import {createHash} from "crypto";

export default function(input: any): string {
    return createHash("sha256").update(input).digest("base64")
}