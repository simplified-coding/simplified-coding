import AuthService from "#server/utils/AuthService";
import EmailService from "#server/utils/EmailService";
import * as z from "zod";
import {type RequestCodeDto, requestCodeDto} from "#shared/utils/requestCodeDto";

export default defineEventHandler(async (e) => {
    const res = await readValidatedBody(e, b => requestCodeDto.safeParse(b));

    if (!res.success)
        throw createError({
            status: 422,
            statusText: "Failed to parse request"
        })

    const data = res.data as RequestCodeDto;
    const code = AuthService.requestCode(data.email);

    await EmailService.sendAuthenticationCode(data.email, code);

    console.log(`${data.email}: ${code}`);
    return {msg: `Sent code to ${data.email}!`}
})