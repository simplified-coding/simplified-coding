// SPDX-FileCopyrightText: 2024 The Simplified Coding Team <main@simplifiedcoding.org>
//
// SPDX-License-Identifier: GPL-3.0-only

export const endpointPB = import.meta.env.ENDPOINT_PB || "https://pb.simplifiedcoding.org"
export const endpointSCDMS = import.meta.env.ENDPOINT_SCDMS || "http://scdms-server.simplifiedcoding.org"

export const getCourseLessons = async (slug: string): Promise<any> => {
    return await fetch(`${endpointSCDMS}/lessons/${slug}`)
        .then((data) => data.json())
}