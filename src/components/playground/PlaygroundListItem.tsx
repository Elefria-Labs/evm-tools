import { HomeCard } from '@components/home/HomeCard';
import { Item } from '@data/playground';

type ListComponentProps = {
  items: Item[];
};

export const PlaygroundListComponent = (props: ListComponentProps) => {
  const { items } = props;
  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items
        .filter((t) => t?.isOnlyExtension != true)
        .map((item: Item) => (
          <HomeCard {...item} key={item.title} />
        ))}
    </div>
  );
};
