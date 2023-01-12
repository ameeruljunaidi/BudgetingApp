import { ActionIcon, Group, Table } from "@mantine/core";
import { IconCheckbox, IconEdit, IconTrash } from "@tabler/icons";
import { Transaction, TransactionDetail } from "../../graphql/__generated__/graphql";
import { useRef } from "react";
import EditTransactionModal, { EditTransactionModalHandler } from "./edit-transaction-modal";
import TransactionRow from "./transaction-row";

type TransactionTableProps = {
  transactions: Transaction[];
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

export default function TransactionTable({ transactions }: TransactionTableProps) {
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
          return <TransactionRow key={transaction._id} transaction={transaction} />;
        })}
      </tbody>
    </Table>
  );
}
