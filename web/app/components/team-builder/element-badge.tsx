import { Badge } from '../ui/badge';
import { type Element } from '~/data/monsters';
import { cn } from '~/lib/utils';

interface ElementBadgeProps {
  element: Element;
  className?: string;
}

const elementColors: Record<Element, string> = {
  Earth: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  Fire: 'bg-red-600 hover:bg-red-700 text-white',
  Water: 'bg-blue-600 hover:bg-blue-700 text-white',
  Wind: 'bg-green-600 hover:bg-green-700 text-white',
  Wild: 'bg-purple-600 hover:bg-purple-700 text-white',
};

export function ElementBadge({ element, className }: ElementBadgeProps) {
  return (
    <Badge className={cn(elementColors[element], className)}>{element}</Badge>
  );
}
