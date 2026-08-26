import * as z from "zod";

export const requestCodeDto = z.object({
    email: z.email('Invalid email'),
});

export type RequestCodeDto = z.infer<typeof requestCodeDto>;
