import crypto from "crypto";
import useUserDb from "#server/utils/useUserDb";
import UserRecord from "#shared/utils/UserRecord";

export default {
    async getUserByEmail(email: string): Promise<UserRecord | null> {
        let db = await useUserDb()
        return await db.get(email).catch(({error}) => {
            if (error == "not_found") return null;
            throw error;
        })
    },

    async newUser(email: string): Promise<UserRecord> {
        let db = await useUserDb()
        let rec = new UserRecord(email);
        rec.roles = ["registered"]

        await db.put({
            _id: email,
            ...rec
        });

        return rec;
    }
}