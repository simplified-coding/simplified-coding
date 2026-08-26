import {readdir, readFile, glob} from "fs/promises"

/**
 * Gets the CouchDB migration remote
 */
function getRemote() {
    return useRuntimeConfig().couchdb.migration.remote;
}

/**
 * Gets the CouchBD migration credentials
 */
function getCredentials() {
    const username = useRuntimeConfig().couchdb.migration.username;
    const password = useRuntimeConfig().couchdb.migration.password;
    return btoa(`${username}:${password}`);
}

/**
 * Constructs a BASIC authentication header with CouchDB migration credentials
 */
function getBasicHeaders() {
    return {
        "Authorization": `Basic ${getCredentials()}`
    }
}

/**
 * Checks if a database exists in the CouchDB instance
 * @param db - Database name
 */
async function hasDatabase(db: string) {
    return await $fetch(`${getRemote()}${db}`, {headers: getBasicHeaders()}).then(_ => true).catch(_ => false)
}

/**
 * Creates a new database in the CouchDB instance
 * @param db - Database name
 */
async function newDatabase(db: string) {
    await $fetch(`${getRemote()}${db}`, {
        method: "PUT",
        headers: getBasicHeaders()
    })
}

/**
 * Gets a database's security
 * @param db - Database name
 */
async function getDatabaseSecurity(db: string) {
    return await $fetch(`${getRemote()}${db}/_security`, {
        headers: getBasicHeaders()
    })
}

/**
 * Sets a database's security
 * @param db - Database name
 * @param sec - Security principal
 */
async function setDatabaseSecurity(db: string, sec: any) {
    await $fetch(`${getRemote()}${db}/_security`, {
        method: "PUT",
        headers: getBasicHeaders(),
        body: sec
    })
}

/**
 * Checks if a database document under the name exists
 * @param db - Database name
 * @param name - Document name
 */
async function hasDatabaseDoc(db: string, name: string) {
    return await $fetch(`${getRemote()}${db}/${name}`, {headers: getBasicHeaders()}).then(_ => true).catch(_ => false)
}

/**
 * Gets a database's document
 * @param db - Database name
 * @param name - Document name
 */
async function getDatabaseDoc(db: string, name: string) {
    return await $fetch(`${getRemote()}${db}/${name}`, {headers: getBasicHeaders()})
}

/**
 * Sets a database's document - the document MUST already exist
 * @param db - Database name
 * @param name - Document name
 * @param data - Document contents
 */
async function setDatabaseDoc(db: string, name: string, data: object) {
    const doc = await getDatabaseDoc(db, name);
    await $fetch(`${getRemote()}${db}/${name}`, {
        headers: getBasicHeaders(),
        method: "PUT",
        query: {
            rev: doc["_rev"]
        },
        body: data
    })
}

/**
 * Creates a new database document - the document MUST NOT already exist
 * @param db - Database name
 * @param name - Document name
 * @param data - Document contents
 */
async function newDatabaseDoc(db: string, name: string, data: object) {
    await $fetch(`${getRemote()}${db}/${name}`, {
        headers: getBasicHeaders(),
        method: "PUT",
        body: data
    })
}

function equal(a: object, b: object) {
    return JSON.stringify(a) == JSON.stringify(b)
}

/**
 * CouchDB simple migration plugin
 */
export default defineNitroPlugin(async () => {
    /**
     * Migration root directory
     */
    const root = "couchdb"

    const databases = await readdir(root)
    for (const database of databases) {
        if (!await hasDatabase(database))
            await newDatabase(database)

        const localSecurityPolicy = JSON.parse(await readFile(`${root}/${database}/_security.json`, "utf8"))
        const remoteSecurityPolicy = await getDatabaseSecurity(database) as object

        if (!equal(localSecurityPolicy, remoteSecurityPolicy))
            await setDatabaseSecurity(database, localSecurityPolicy)

        let docs = await Array.fromAsync(glob(`${root}/${database}/docs/**/*.json`))
        docs = docs.map(d => d.replace(`${root}/${database}/docs/`, "").replace(".json",""))


        for (const docName of docs) {
            let localDocument = JSON.parse(await readFile(`${root}/${database}/docs/${docName}.json`, "utf8"))


            if (await hasDatabaseDoc(database, docName)) {
                let remoteDocument = await getDatabaseDoc(database, docName)
                delete remoteDocument["_rev"]

                if (!equal(localDocument, remoteDocument))
                    await setDatabaseDoc(database, docName, localDocument)
            } else {
                await newDatabaseDoc(database, docName, localDocument)
            }
        }
    }
})