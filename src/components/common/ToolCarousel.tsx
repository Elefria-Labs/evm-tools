import React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@shadcn-components/ui/carousel';
import { Item } from '@data/playground';
import { HomeCardMini } from '@components/home/HomeCardMini';

type ToolCarouselProps = {
  playgroundTools: Item[];
};

export default function ToolCarousel(props: ToolCarouselProps) {
  const { playgroundTools } = props;
  return (
    <div>
      <p className="mt-8 mb-4 text-xl font-bold">Other similar tools</p>
      <Carousel
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent>
          {playgroundTools.map((tool, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <HomeCardMini {...tool} key={tool.title} glow={tool.isBeta} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
