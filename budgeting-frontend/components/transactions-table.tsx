import { Transaction } from "../graphql/__generated__/graphql";

type TransactionTableProps = {
    transactions: Transaction[];
};

export default function TransactionTable({ transactions }: TransactionTableProps) {
    return <div>{JSON.stringify(transactions)}</div>;
}
