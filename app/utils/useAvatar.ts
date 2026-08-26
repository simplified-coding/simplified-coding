import {createAvatar} from "@dicebear/core";
import {identicon} from "@dicebear/collection";

export default function(): string {
    const { session, loggedIn } = useUserSession();

    if (!loggedIn)
        throw new Error("User not logged in");

    return createAvatar(identicon, {
        seed: session.value!.user!.identifier
    }).toDataUri()
};