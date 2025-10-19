import Link from 'next/link';
import type { VkmApi } from '@/app/vkms/types/vkm';

export function VkmCard({ vkm }: { vkm: VkmApi }) {
  return (
    <Link
      href={`/vkms/${vkm._id}`}
      className="group block rounded-lg border border-gray-200 bg-white p-4 transition-colors no-underline !text-gray-900 hover:!text-gray-700"
    >
      <div className="flex justify-between items-start">
        <h2 className="!text-lg font-medium leading-snug">
          {vkm.name}
        </h2>
        <span className="text-sm text-gray-500">{vkm.ec} EC</span>
      </div>

      {vkm.description && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{vkm.description}</p>
      )}

      <div className="flex gap-2 mt-2 text-sm text-gray-500">
        {vkm.level && <span>{vkm.level}</span>}
        {vkm.location && (<><span>•</span><span>{vkm.location}</span></>)}
      </div>
    </Link>
  );
}
