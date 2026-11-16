import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { storeUrl } from '@/lib/config';

/** Opens the WORSTART General Store (Shopify) in a new tab. */
export function StoreLink({ children = 'Visit the General Store', className = '', path = '', onClick }: { children?: ReactNode; className?: string; path?: string; onClick?: () => void }) {
  return (
    <a href={`${storeUrl}${path}`} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} data-testid="link-store">
      {children}<ArrowUpRight className="h-4 w-4 shrink-0" /><span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
