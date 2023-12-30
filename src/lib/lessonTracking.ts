import {setCookie} from "./cookie";
import {getEntry} from "astro:content";

export const refreshLessons = async () => {
  let data: any = {}

  if (localStorage.getItem("tracking-lessons")) {
    data = JSON.parse(localStorage.getItem("tracking-lessons") || "{}")
  }

  (await getEntry("lessons", "courses")).data.courses.map((c: { slug: string }) => {
    if (!data.hasOwnProperty(c.slug)) {
      data[c.slug] = []
    }
  })

  console.log("[INFO] Lesson Cookies Refreshed")
  localStorage.setItem("tracking-lessons", JSON.stringify(data))

  if (localStorage.getItem("tracking-completed") == null) {
    localStorage.setItem("tracking-completed", JSON.stringify("[]"))
  }
}

export const addLesson = async () => {
  const data = JSON.parse(localStorage.getItem("tracking-lessons") || "{}")

  if (data[location.pathname.split('/')[2]].indexOf(new URLSearchParams(location.search).get("lesson")) === -1) {
    data[location.pathname.split('/')[2]].push(new URLSearchParams(location.search).get("lesson"))
  }

  setInterval(async () => {
    setCookie("tracking-lessons", JSON.stringify(data))
    await checkCompletion()
  }, 1000)
}

export const checkCompletion = async () => {
  const course = location.pathname.split('/')[2]
  const trackingCompleted: any = JSON.parse(localStorage.getItem("tracking-completed") || "")
  const trackingLessons: [] = JSON.parse(localStorage.getItem("tracking-lessons") || "")[course]
  const courseData = (await getEntry("lessons", course))

  if (trackingLessons.length === courseData?.data.data.length) {
    if (trackingCompleted.indexOf(course) === -1) {
      trackingCompleted.push(course)
    }
  }

  setInterval(() => {
    localStorage.setItem("tracking-completed", JSON.stringify(trackingCompleted))
  }, 1000)
}
