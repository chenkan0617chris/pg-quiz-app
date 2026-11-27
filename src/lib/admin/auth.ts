import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { unstable_rethrow } from 'next/navigation';
import { isAdminId } from './policy';

export async function adminIdentity() {
  // Static-file requests (e.g. a missing /apple-touch-icon.png) skip the proxy,
  // so Clerk's auth() throws when the root layout renders their 404. Treat that
  // as signed out instead of turning every missing asset into a 500, but let
  // Next.js's own control-flow errors (dynamic usage, notFound) pass through.
  let userId: string | null = null;
  try {
    ({ userId } = await auth());
  } catch (error) {
    unstable_rethrow(error);
    userId = null;
  }
  return { userId, allowed: isAdminId(userId, process.env.ADMIN_USER_IDS) };
}
