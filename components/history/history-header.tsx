import Link from 'next/link';
import Button from '@/components/ui/button';

export default function HistoryHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">환전 내역</h1>
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="outline">환전하기</Button>
        </Link>
      </div>
    </div>
  );
}
