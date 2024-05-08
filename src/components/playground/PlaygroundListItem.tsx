import { HomeCard } from '@components/home/HomeCard';
import { Item } from '@data/playground';

type ListComponentProps = {
  items: Item[];
};

export const PlaygroundListComponent = (props: ListComponentProps) => {
  const { items } = props;
  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      {items.map((item: Item) => (
        <HomeCard {...item} key={item.title} />
      ))}
    </div>
  );
};
