export const getCookies = () => {
  return document.cookie.split(';').map(c => c.trim().split('=')[0])
}
export const getCookie = (cookieName: string) => {
  return document.cookie.split(';').filter((c) => c.trim().startsWith(cookieName))[0].split('=')[1]
}
export const setCookie = (cookieName: string, cookieValue: string) => {
  return document.cookie = `${cookieName}=${cookieValue};samesite=lax;max-age=15778476;path=/;secure`
}
export const deleteCookie = (cookieName: string) => {
  setCookie(cookieName, "")
}
export const hasCookie = (cookieName: string) => {
  return getCookies().filter(c => c == cookieName).length > 0
}
export const revalidateCookies = () => {
  getCookies().forEach(c => revalidateCookie(c))
}
export const revalidateCookie = (cookieName: string) => {
  const value = getCookie(cookieName)
  deleteCookie(cookieName)
  setCookie(cookieName, value)
}

export const cookiesEnabled = () => {
  return getCookie("accepted") == "true"
}
