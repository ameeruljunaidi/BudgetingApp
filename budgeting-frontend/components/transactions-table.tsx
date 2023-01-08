import { createStyles, Table } from "@mantine/core";
import { Transaction, TransactionDetail } from "../graphql/__generated__/graphql";

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

    const rows = transactions.map(transaction => {
        const transactionDetails = transaction.transactionDetails;

        const aggregateTransactionDetail: TransactionDetail = {
            amount: transactionDetails.reduce((accum, transaction) => accum + transaction.amount, 0),
            category: transactionDetails[0].category,
            categoryGroup: transactionDetails[0].categoryGroup,
            payee: transactionDetails[0].payee,
        };

        return (
            <tr key={transaction._id}>
                <td>{aggregateTransactionDetail.payee}</td>
                <td>{aggregateTransactionDetail.categoryGroup}</td>
                <td>{aggregateTransactionDetail.category}</td>
                <td>
                    {aggregateTransactionDetail.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </td>
            </tr>
        );
    });

    return (
        <Table striped highlightOnHover bg="white" withBorder>
            <thead>
                <tr>
                    <th>Payee</th>
                    <th>Category Group</th>
                    <th>Category</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>
    );
}
