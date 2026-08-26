import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/identicon.json' with { type: 'json' };

export default function (): string {
  const { session, loggedIn } = useUserSession();

  if (!loggedIn)
    throw new Error("User not logged in");

  const style = new Style(definition);
  return new Avatar(style, { "seed": session.value!.user!.identifier }).toDataUri();
};
