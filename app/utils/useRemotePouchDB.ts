import PouchDB from 'pouchdb';

export default function (database: string): PouchDB.Database {
    const host = useRequestURL().host
    const protocol = useRequestURL().protocol
    return new PouchDB(`${protocol}//${host}/api/couch/${database}`)
}