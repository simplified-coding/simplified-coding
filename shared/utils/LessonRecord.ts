export default class LessonRecord {
    index: number;
    courseId: string;
    title: string;
    description: string;
    draft: boolean;
    data: string;

    constructor(index: number, courseId: string, title: string, description: string, draft: boolean, data: string) {
        this.index = index;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.draft = draft;
        this.data = data;
    }
}