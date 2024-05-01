// SPDX-FileCopyrightText: 2024 The Simplified Coding Team <main@simplifiedcoding.org>
//
// SPDX-License-Identifier: GPL-3.0-only

import {getEntry} from "astro:content";

export const refreshLessons = async () => {
  let data: any = [];

  (await getEntry("lessons", "courses")).data.courses.map((c: { slug: string }) => data.push(c.slug))

  localStorage.setItem("lessons", JSON.stringify(data))
}

export const addLesson = async () => {
  const course = location.pathname.split('/')[2]
  const lesson = new URLSearchParams(location.search).get("lesson")

  const item = localStorage.getItem(course)
  if (item) {
    const data: Array<string> = JSON.parse(item || "[]")

    if (data.indexOf(lesson || "") == -1) {
      data.push(lesson || "")
    }

    localStorage.setItem(course, JSON.stringify(data))
  } else {
    localStorage.setItem(course, JSON.stringify([lesson]))
  }
  await checkCompletion()
}

export const removeLesson = (course: string, lesson: string) => {
  const item = localStorage.getItem(course)

  if (item) {
    let data: Array<string> = JSON.parse(item || "[]")
    data = data.filter(v => v != lesson)
    localStorage.setItem(course, JSON.stringify(data))
  }
}
export const checkCompletion = async () => {
  const course = location.pathname.split('/')[2]
  const trackingCompleted: any = JSON.parse(localStorage.getItem("completed") || "[]")
  const trackingLessons: [] = JSON.parse(localStorage.getItem(course) || "[]")
  const courseData: any = (await getEntry("lessons", course))

  if (trackingLessons.length === courseData?.data.data.length) {
    if (trackingCompleted.indexOf(course) === -1) {
      trackingCompleted.push(course)
    }
  }

  localStorage.setItem("completed", JSON.stringify(trackingCompleted))
}
