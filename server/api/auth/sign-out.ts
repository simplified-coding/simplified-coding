export default defineEventHandler(async (e) => {
    await clearUserSession(e)
})