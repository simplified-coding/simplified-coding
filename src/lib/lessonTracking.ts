import {getCookie, hasCookie, setCookie} from "./cookie";
import {getEntry} from "astro:content";

export const refreshLessons = async () => {
  let data: any = {}

  if (hasCookie("tracking-lessons")) {
    data = JSON.parse(getCookie("tracking-lessons"))
  }

  (await getEntry("lessons", "courses")).data.courses.map((c: { slug: string }) => {
    if (!data.hasOwnProperty(c.slug)) {
      console.log(`Adding ${c.slug}`)
      data[c.slug] = []
    }
  })

  console.log("[INFO] Lesson Cookies Refreshed")
  setCookie("tracking-lessons", JSON.stringify(data))

  if (!hasCookie("tracking-completed")) {
    setCookie("tracking-completed", "[]")
  }
}

export const addLesson = async () => {
  const data = JSON.parse(getCookie("tracking-lessons"))

  if (data[location.pathname.split('/')[2]].indexOf(new URLSearchParams(location.search).get("lesson")) === -1) {
    data[location.pathname.split('/')[2]].push(new URLSearchParams(location.search).get("lesson"))
  }

  setCookie("tracking-lessons", JSON.stringify(data))
  await checkCompletion()
}

export const checkCompletion = async () => {
  const course = location.pathname.split('/')[2]
  const trackingCompleted: any = JSON.parse(getCookie("tracking-completed"))
  const trackingLessons: [] = JSON.parse(getCookie("tracking-lessons"))[course]
  const courseData = (await getEntry("lessons", course))

  if (trackingLessons.length === courseData?.data.data.length) {
    if (trackingCompleted.indexOf(course) === -1) {
      trackingCompleted.push(course)
    }
  }

  setCookie("tracking-completed", JSON.stringify(trackingCompleted))
}
