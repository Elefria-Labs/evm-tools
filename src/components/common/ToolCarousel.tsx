import React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@shadcn-components/ui/carousel';
import { Card } from '@chakra-ui/react';
import { CardContent } from '@shadcn-components/ui/card';
import { Item } from '@data/playground';
import { HomeCard } from '@components/home/HomeCard';

type ToolCarouselProps = {
  playgroundTools: Item[];
};

export default function ToolCarousel(props: ToolCarouselProps) {
  const { playgroundTools } = props;
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
    >
      <CarouselContent>
        {playgroundTools.map((tool, i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <HomeCard {...tool} key={tool.title} glow={tool.isBeta} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
