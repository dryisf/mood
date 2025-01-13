import HistoryChart from '@/components/HistoryChart';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

async function getData() {
  const user = await getUserByClerkId();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const sum = analyses.reduce((all, current) => {
    return all + current.sentimentScore;
  }, 0);
  const avg = Math.round(sum / analyses.length);

  return { analyses, avg };
}

export default async function History() {
  const { avg, analyses } = await getData();
  return (
    <div className="w-full h-full">
      <div>{`Avg. Sentiment ${avg}`}</div>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
}
