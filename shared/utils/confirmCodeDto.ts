import * as z from "zod";

export const confirmCodeDto = z.object({
    email: z.email('Invalid email'),
    code: z.string()
        .length(6, "Code must be exactly 6 characters")
        .regex(/^[0-9]*$/, "Code must contain only numbers")
})

export type ConfirmCodeDto = z.infer<typeof confirmCodeDto>;