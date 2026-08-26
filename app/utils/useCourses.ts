import type CourseRecord from "#shared/utils/CourseRecord";
import useRemotePouchDB from "~/utils/useRemotePouchDB";

export default async function(): Promise<PouchDB.Database<CourseRecord>> {
    let db =  useLocalPouchDB("courses") as PouchDB.Database<CourseRecord>;
    let remote = useRemotePouchDB("sc-courses") as PouchDB.Database<CourseRecord>;

    await db.replicate.from(remote).catch(e => console.error(e));

    await db.createIndex({
        index: {fields: ['draft']}
    })

    return db;
}