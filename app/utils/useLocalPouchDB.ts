import PouchDB from 'pouchdb';

export default function (database: string): PouchDB.Database {
    return new PouchDB(`pdb_${database}`)
}