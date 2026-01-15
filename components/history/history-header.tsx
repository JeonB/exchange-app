import Link from 'next/link';
import Button from '@/components/ui/button';
import Typography from '@/components/ui/typography';

export default function HistoryHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <Typography variant="h1" className="text-3xl">환전 내역</Typography>
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="outline">환전하기</Button>
        </Link>
      </div>
    </div>
  );
}
