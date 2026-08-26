import * as z from "zod";

import {confirmCodeDto, type ConfirmCodeDto} from "#shared/utils/confirmCodeDto";
import useHash from "#server/utils/useHash";
import UserService from "#server/utils/UserService";
import AuthService from "#server/utils/AuthService";

export default defineEventHandler(async (e) => {
    const res = await readValidatedBody(e, b => confirmCodeDto.safeParse(b));

    if (!res.success)
        throw createError({
            status: 422,
            statusText: "Failed to parse request"
        })

    const data = res.data as ConfirmCodeDto;
    if (!AuthService.checkCode(res.data.email, data.code)) {
        throw createError({status: 401, statusText: "Failed to confirm code"})
    }

    let user = await UserService.getUserByEmail(data.email);
    if (user == null)
        user = await UserService.newUser(data.email)

    await setUserSession(e, {
       user: {
           identifier: useHash(data.email),
           roles: user.roles
       },
        secure: {
           email: data.email
        }
    });

    return {msg: `Confirmed Code!`};
})