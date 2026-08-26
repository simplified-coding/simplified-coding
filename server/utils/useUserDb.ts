import Database = PouchDB.Database;
import UserRecord from "#shared/utils/UserRecord";
import useRemoteAdminPouchDb from "#server/utils/useRemoteAdminPouchDb";

let _db: Database<UserRecord> | null = null;
export default async function(): Promise<Database<UserRecord>> {
    if (_db == null)
        _db = await useRemoteAdminPouchDb("sc-users") as Database<UserRecord>;
    return _db;
}