// SPDX-FileCopyrightText: 2024 The Simplified Coding Team <main@simplifiedcoding.org>
//
// SPDX-License-Identifier: GPL-3.0-only

export const endpointPB = import.meta.env.ENDPOINT_PB || "https://pb.simplifiedcoding.org"
export const endpointSCDMS = import.meta.env.ENDPOINT_SCDMS || "https://scdms-server.simplifiedcoding.org"

export const getCourseLessons = async (slug: string): Promise<any> => {
  return await fetch(`${endpointSCDMS}/lessons/${slug}`)
    .then((data) => data.json())
}

// export const getCourse = async (course: string): Promise<any> => {
//   return await fetch(`${endpointPB}/api/collections/sc_courses/records?filter=(slug='${course}')&&draft=false`)
//     .then((data => data.json))
//     .then((data: any) => data.items[0])
// }

export const getCourse = async (course: string): Promise<any> => {
  return await fetch(`${endpointSCDMS}/course/${course}`)
    .then((data) => data.json())
}

// export const getCourses = async (): Promise<any> => {
//   return await fetch(`${endpointPB}/api/collections/sc_courses/records`)
//     .then((data) => data.json())
// }

export const getCourses = async (): Promise<any> => {
  return await fetch(`${endpointSCDMS}/course/all`)
    .then(data => data.json())
}

export const getRawLesson = async (course: string, lesson: number): Promise<any> => {
  return await fetch(`${endpointSCDMS}/lessons/${course}/${lesson}?raw=true`)
    .then((data) => data.text())
}

export const getHtmlLessonLink = (course: string, lesson: number): string => {
  return `${endpointSCDMS}/lessons/${course}/${lesson}`
}
