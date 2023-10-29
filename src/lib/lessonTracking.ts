import {cookiesEnabled, getCookie, hasCookie, setCookie} from "./cookie";
import {getEntry} from "astro:content";

export const getLessons = () => {
  return JSON.parse(getCookie("tracking"))["lessons"]
}

export const getCurrentLesson = () => {
  return new URLSearchParams(location.search).get("lesson")

}
export const getCurrentCourse = () => {
  return location.pathname.split('/')[2]

}
export const getCurrentLessons = () => {
  return getLessons()[getCurrentCourse()]
}
export const hasCurrentLessonInCurrentCourse = () => {
  return getCurrentLessons().indexOf(getCurrentLesson()) != -1

}
export const addCurrentLesson = async () => {
  if (cookiesEnabled()) {
    if (!hasCurrentLessonInCurrentCourse()) {
      const cookie = JSON.parse(getCookie("tracking"))
      cookie.lessons[getCurrentCourse()].push(getCurrentLesson())

      setCookie("tracking", JSON.stringify(cookie))
      console.log('[INFO] Tracked lesson completion')
    } else {
      console.log("[INFO] Ignoring, addCurrentLesson request, lesson already completed!")
    }

    await isCourseCompleted(getCurrentCourse())
  } else {
    console.log("[INFO] Ignoring, addCurrentLesson request, cookies disabled!")
  }
}

export const unmarkCourseCompleted = (course: string) => {
  let tracking = JSON.parse(getCookie("tracking"))

  tracking.completed.filter((element: string) => element != course)

  console.log(`Cookie completed is now: ${tracking.completed}`)
  setCookie("tracking", JSON.stringify(tracking))
}

export const markCourseCompleted = (course: string) => {
  let tracking = JSON.parse(getCookie("tracking"))

  if (tracking.completed.indexOf(course) == -1) {
    tracking.completed.push(course)
  }

  console.log(`Cookie completed is now: ${tracking.completed}`)
  setCookie("tracking", JSON.stringify(tracking))
}

export const isCourseCompleted = async (course: string) => {
  let courseData = (await getEntry("lessons", course)) || {
    data: undefined
  };
  let courseLength = courseData.data.data.length;
  let completedLength = getLessons()[getCurrentCourse()].length

  if (completedLength == courseLength) {
    markCourseCompleted(getCurrentCourse())
  } else {
    unmarkCourseCompleted(getCurrentCourse())
  }
}

export const refreshLessons = async () => {
  let data: { completed: Array<string>, lessons: any } = {
    completed: [],
    lessons: {}
  };

  if (hasCookie("tracking")) {
    data = JSON.parse(getCookie("tracking"))
  }

  (await getEntry("lessons", "courses")).data.courses.map((course: { slug: string }) => {
    if (!data.lessons.hasOwnProperty(course.slug)) {
      data.lessons[course.slug] = []
    }
  })

  console.log("Refreshing lesson cookies")
  setCookie("tracking", JSON.stringify(data))
}