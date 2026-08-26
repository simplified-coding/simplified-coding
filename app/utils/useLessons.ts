import useRemotePouchDB from "~/utils/useRemotePouchDB";
import type LessonRecord from "#shared/utils/LessonRecord";

export default async function(): Promise<PouchDB.Database<LessonRecord>> {
    let db =  useLocalPouchDB("lessons") as PouchDB.Database<LessonRecord>;
    let remote = useRemotePouchDB("sc-lessons") as PouchDB.Database<LessonRecord>;

    await db.replicate.from(remote).catch(e => console.error(e));

    await db.createIndex({
        index: {fields: ['draft', 'courseId']}
    })

    return db;
}