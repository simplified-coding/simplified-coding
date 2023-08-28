import {cookiesEnabled, getCookie, setCookie} from "./cookie";

export const getCompletedLessons = () => {
  return JSON.parse(getCookie("completed"))

}
export const getCurrentLesson = () => {
  return new URLSearchParams(location.search).get("lesson")

}
export const getCurrentCourse = () => {
  return location.pathname.split('/')[2]

}
export const getCurrentCompletedLessons = () => {
  return getCompletedLessons()[getCurrentCourse()]
}
export const hasCompletedCurrentLessonInCurrentCourse = () => {
  return getCurrentCompletedLessons().indexOf(getCurrentLesson()) != -1

}
export const addCurrentLesson = () => {
  if (cookiesEnabled()) {
    if (!hasCompletedCurrentLessonInCurrentCourse()) {
      const courses = getCompletedLessons()
      courses[getCurrentCourse()].push(getCurrentLesson())
      setCookie("completed", JSON.stringify(courses))
      console.log('[INFO] Tracked lesson completion')
    } else {
      console.log("[INFO] Ignoring, addCurrentLesson request, lesson already completed!")
    }

  } else {
    console.log("[INFO] Ignoring, addCurrentLesson request, cookies disabled!")
  }
}