import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

async function getEntry(id: string) {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id: id,
      },
    },
    include: { analysis: true },
  });

  return entry;
}

export default async function EntryPage({ params }) {
  const { id } = await params;
  const entry = await getEntry(id);

  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  );
}
