import { auth } from '@clerk/nextjs/server';
import { prisma } from './db';

type Params = {
  include?: object;
  select?: object;
};
export async function getUserByClerkId({ include, select }: Params = {}) {
  const { userId } = await auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: { clerkId: userId },
    include,
    select,
  });

  return user;
}
