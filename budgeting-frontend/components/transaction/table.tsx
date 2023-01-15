import { Center, Loader, Table, Text } from "@mantine/core";
import { Transaction } from "../../graphql/__generated__/graphql";
import TransactionRow from "./row";

type TransactionTableProps = {
  loading: boolean;
  transactions: Transaction[];
  accountCurrency: string;
};

export default function TransactionTable({ loading, transactions, accountCurrency }: TransactionTableProps) {
  if (!loading && transactions.length === 0) {
    return (
      <Center p={24}>
        <Text>No Transactions</Text>
      </Center>
    );
  }

  return (
    <Table striped highlightOnHover bg="white" withBorder horizontalSpacing="md">
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
        {transactions.map((transaction) => {
          return <TransactionRow key={transaction._id} transaction={transaction} accountCurrency={accountCurrency} />;
        })}
      </tbody>
    </Table>
  );
}
