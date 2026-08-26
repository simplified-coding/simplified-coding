import PouchDB from "pouchdb"
import PouchDB_Find from "pouchdb-find"

export default defineNuxtPlugin((nuxtApp) => {
    PouchDB.plugin(PouchDB_Find)
})