import PouchDB from "pouchdb"

/**
 * Gets a remote PouchDB that is logged in with admin credentials
 * @param database name
 */
export default async function(database: string) {
    const remote = useRuntimeConfig().couchdb.remote.admin;
    return new PouchDB(`${remote}/${database}`, {skip_setup: true})
}