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
  const course = location.pathname.split('/')[2]
  const lesson = new URLSearchParams(location.search).get("lesson")

  const item = localStorage.getItem(course)
  if (item) {
    const data: Array<string> = JSON.parse(item || "[]")
    data.push(lesson || "")
    localStorage.setItem(course, JSON.stringify(data))
  } else {
    localStorage.setItem(course, JSON.stringify([lesson]))
  }
  await checkCompletion()
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

  localStorage.setItem("tracking-completed", JSON.stringify(trackingCompleted))
}
