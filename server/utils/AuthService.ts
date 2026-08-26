import cache from "node-cache"

const codeCache = new cache();

export default {
    /**
     * Generates a new authentication code
     * @param email users email
     */
    requestCode(email: string): string {
        const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        codeCache.set(email, code, 60 * 15);
        return code;
    },

    /**
     * Checks if the `code` matches the users authentication code.
     * Invalidates the code after use
     * @param email users email
     * @param code to check
     */
    checkCode(email: string, code: string): boolean {
        if (!codeCache.has(email)) return false;
        if (codeCache.get(email) !== code) return false;

        codeCache.del(email);
        return true;
    }
}