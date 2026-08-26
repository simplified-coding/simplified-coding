import useHash from "#server/utils/useHash";
import useHmac from "#server/utils/useHmac";

type HTTPMethod = "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE"

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);
    const method = event.method.toUpperCase() as HTTPMethod;

    if (!event.context.params)
        throw createError({
            status: 422,
            statusText: "Failed to parse request"
        })

    const path = event.context.params["_"]
    if (!path)
        throw createError({
            status: 422,
            statusText: "Failed to parse request"
        })

    const session = await getUserSession(event)
    const secret = useRuntimeConfig().couchdb.secret
    const remote = useRuntimeConfig().couchdb.remote.proxy

    const xForwardedFor = getRequestIP(event)!;
    const xForwardedProto = url.protocol.split(":")[0]!;
    const xForwardedHost = url.host
    const xUsername = session.secure ? useHash(session.secure.email) : "anonymous"
    const xRoles = session.user ? session.user.roles.join(",") : "public"
    const xToken = useHmac(xUsername, secret)

    let headers: HeadersInit = {
        "X-Forwarded-For": xForwardedFor,
        "X-Forwarded-Proto": xForwardedProto,
        "X-Forwarded-Host": xForwardedHost,
        "X-Auth-CouchDB-UserName": xUsername,
        "X-Auth-CouchDB-Roles": xRoles,
        "X-Auth-CouchDB-Token": xToken,
    };

    if (method == "POST" || method == "PUT") {
        headers["Content-Type"] = event.headers.get("Content-Type")!;
    }

    console.log("Request to ", remote, path, "with headers ", headers, "with method", event.method)

    if (method == "POST" || method == "PUT") {
        const body = await readBody(event);
        return await $fetch(`${remote}${path}${url.search}`, {
            headers: headers,
            query: url.searchParams,
            method: method,
            body: body
        })
    }

    return await $fetch(`${remote}${path}${url.search}`, {
        headers: headers,
        query: url.searchParams,
        method: method
    })
})