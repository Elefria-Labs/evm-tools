import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import {
  CardTitle,
  CardContent,
  Card,
  CardFooter,
  CardHeader,
} from '@shadcn-components/ui/card';
import { Button } from '@shadcn-components/ui/button';
import Link from 'next/link';

export type HomeCardPropsType = {
  title: string;
  description?: string;
  link?: string;
  category?: string;
  tags?: string;
  isExternal?: boolean;
  glow?: boolean;
};

export function HomeCard(props: HomeCardPropsType) {
  return (
    <div className={props.glow ? 'box glowing' : ''}>
      <Card className="h-[254px] min-w-[325px]">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="min-h-[72px] font-thin">{props.description}</p>
        </CardContent>
        <CardFooter>
          <Link
            className="w-full"
            aria-label={props.title}
            href={props.isExternal ? `${props.link}` : `/${props.link}`}
            style={{ textDecoration: 'none' }}
            target={props?.isExternal ? '_blank' : ''}
          >
            <Button className="w-full">
              Open &nbsp;
              {props?.isExternal && (
                <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
              )}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
