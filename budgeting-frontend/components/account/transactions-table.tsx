import { Table } from "@mantine/core";
import { Transaction } from "../../graphql/__generated__/graphql";
import TransactionRow from "./transaction-row";

type TransactionTableProps = {
  transactions: Transaction[];
  accountCurrency: string;
};

// const useStyles = createStyles(theme => {
//     return {
//         tableHead: {
//             backgroundColor: theme.black,
//             color: theme.white,
//         },
//         tableRow: {
//             backgroundColor: theme.white,
//         },
//     };
// });

export default function TransactionTable({ transactions, accountCurrency }: TransactionTableProps) {
  // const { classes } = useStyles();

  return (
    <Table striped highlightOnHover bg="white" withBorder>
      <thead>
        <tr>
          <th>Date</th>
          <th>Payee</th>
          <th>Category</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => {
          return <TransactionRow key={transaction._id} transaction={transaction} accountCurrency={accountCurrency} />;
        })}
      </tbody>
    </Table>
  );
}
