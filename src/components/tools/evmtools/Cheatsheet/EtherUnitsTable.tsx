import { Label } from '@shadcn-components/ui/label';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@shadcn-components/ui/table';

const etherUnits = [
  {
    unitName: 'wei',
    decimals: 0,
  },
  {
    unitName: 'kwei',
    decimals: 3,
  },
  {
    unitName: 'mwei',
    decimals: 6,
  },
  {
    unitName: 'gwei',
    decimals: 9,
  },
  {
    unitName: 'szabo',
    decimals: 12,
  },
  {
    unitName: 'finney',
    decimals: 15,
  },
  {
    unitName: 'ether',
    decimals: 18,
    FIELD3: '',
  },
];
export default function EtherUnitsTable() {
  return (
    <div className="mt-4">
      <Label>Ether Units</Label>
      <Table className="max-w-[460px]">
        <TableCaption>
          1 ether in wei, has 18 decimal places (i.e. 1 ether represents 10^18
          wei)
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Unit</TableHead>
            <TableHead className="text-right">Decimals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {etherUnits.map((u) => (
            <TableRow key={u.unitName}>
              <TableCell className="font-medium">{u.unitName}</TableCell>
              <TableCell className="text-right">{u.decimals}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
