import * as z from 'zod';

export default class CourseRecord {
    title: string;
    description: string;
    requirements: string;
    icon: string;
    language: string;
    duration: string;
    difficulty: number;
    draft: boolean;

    constructor(title: string, description: string, requirements: string, icon: string, language: string, duration: string, difficulty: number, draft: boolean) {
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.icon = icon;
        this.language = language;
        this.duration = duration;
        this.difficulty = difficulty;
        this.draft = draft;
    }
}

export const courseRecordSchema = z.object({
    title: z.string().min(3).max(80),
    description: z.string().max(65535),
    requirements: z.string().max(80).default("Δεν χρειάζεται προηγούμενη γνώση"),
    icon: z.string(),
    language: z.string().max(32),
    duration: z.string().max(24),
    difficulty: z.number().min(1).max(5),
    draft: z.boolean().default(true),
})