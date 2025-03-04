import { CardTitle, Card, CardHeader } from '@shadcn-components/ui/card';
import Link from 'next/link';
import { Badge } from '@shadcn-components/ui/badge';

export type HomeCardPropsType = {
  title: string;
  description?: string;
  link?: string;
  category?: string;
  tags?: string;
  isExternal?: boolean;
  glow?: boolean;
};

export function HomeCardMini(props: HomeCardPropsType) {
  return (
    <div
      className={`h-[68px] min-w-[325px] ${props.glow ? 'box glowing' : ''}`}
    >
      <Link
        className="w-full"
        aria-label={props.title}
        href={props.isExternal ? `${props.link}` : `/${props.link}`}
        style={{ textDecoration: 'none' }}
        target={props?.isExternal ? '_blank' : ''}
      >
        <Card className="h-[68px] min-w-[325px]">
          <CardHeader>
            <CardTitle>
              {props.title}
              <span>
                {props?.glow && <Badge className="ml-2 py-0.4">New</Badge>}
              </span>
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
          <p className="min-h-[72px] font-thin">{props.description}</p>
        </CardContent> */}
          {/* <CardFooter className={`w-full`}>
          <Link
            className="w-full"
            aria-label={props.title}
            href={props.isExternal ? `${props.link}` : `/${props.link}`}
            style={{ textDecoration: 'none' }}
            target={props?.isExternal ? '_blank' : ''}
          >
            <Button className={`w-full`}>
              Open &nbsp;
              {props?.isExternal && (
                <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
              )}
            </Button>
          </Link>
        </CardFooter> */}
        </Card>
      </Link>
    </div>
  );
}
