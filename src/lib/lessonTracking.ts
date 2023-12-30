// export const getLessons = () => {
//   return JSON.parse(getCookie("tracking"))["lessons"]
// }
//
// export const getCurrentLesson = () => {
//   return new URLSearchParams(location.search).get("lesson")
//
// }
// export const getCurrentCourse = () => {
//   return location.pathname.split('/')[2]
//
// }
// export const getCurrentLessons = () => {
//   return getLessons()[getCurrentCourse()]
// }
// export const hasCurrentLessonInCurrentCourse = () => {
//   return getCurrentLessons().indexOf(getCurrentLesson()) != -1
//
// }
// export const addCurrentLesson = async () => {
//   if (cookiesEnabled()) {
//     if (!hasCurrentLessonInCurrentCourse()) {
//       const cookie = JSON.parse(getCookie("tracking"))
//       cookie.lessons[getCurrentCourse()].push(getCurrentLesson())
//
//       setCookie("tracking", JSON.stringify(cookie))
//       console.log('[INFO] Tracked lesson completion')
//     } else {
//       console.log("[INFO] Ignoring, addCurrentLesson request, lesson already completed!")
//     }
//
//     await isCourseCompleted(getCurrentCourse())
//   } else {
//     console.log("[INFO] Ignoring, addCurrentLesson request, cookies disabled!")
//   }
// }
//
// export const unmarkCourseCompleted = (course: string) => {
//   let completed = JSON.parse(getCookie("completed"))
//
//   completed.filter((element: string) => element != course)
//
//   console.log(`Cookie completed is now: ${completed}`)
//   setCookie("completed", JSON.stringify(completed))
// }
//
// export const markCourseCompleted = (course: string) => {
//   let completed = JSON.parse(getCookie("completed"))
//
//   if (completed.indexOf(course) == -1) {
//     completed.push(course)
//   }
//
//   console.log(`Cookie completed is now: ${completed}`)
//   setCookie("completed", JSON.stringify(completed))
// }
//
// export const isCourseCompleted = async (course: string) => {
//   let courseData = (await getEntry("lessons", course)) || {
//     data: undefined
//   };
//   let courseLength = courseData.data.data.length;
//   let completedLength = getLessons()[getCurrentCourse()].length
//
//   if (completedLength == courseLength) {
//     markCourseCompleted(getCurrentCourse())
//   } else {
//     unmarkCourseCompleted(getCurrentCourse())
//   }
// }

import {getCookie, hasCookie, setCookie} from "./cookie";
import {getEntry} from "astro:content";

export const refreshLessons = async () => {
  let data: any = {}

  if (hasCookie("tracking-lessons")) {
    data = JSON.parse(getCookie("tracking-lessons"))
  }

  (await getEntry("lessons", "courses")).data.courses.map((c: { slug: string }) => {
    if (!data.hasOwnProperty(c.slug)) {
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