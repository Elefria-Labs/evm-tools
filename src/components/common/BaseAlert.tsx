import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@shadcn-components/ui/alert';
import { ExclamationTriangleIcon, CheckboxIcon } from '@radix-ui/react-icons';

type BaseAlertPropsType = {
  open: boolean;
  title: string;
  description?: string;
  type?: 'destructive';
};

export default function BaseAlert(props: BaseAlertPropsType) {
  return props.open ? (
    <Alert variant={props?.type}>
      {props?.type ? (
        <ExclamationTriangleIcon className="h-4 w-4" />
      ) : (
        <CheckboxIcon className="h-4 w-4" />
      )}
      <AlertTitle>{props.title}</AlertTitle>
      <AlertDescription>{props.description}</AlertDescription>
    </Alert>
  ) : (
    <></>
  );
}
