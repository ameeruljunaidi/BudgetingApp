import { useMutation } from "@apollo/client";
import { ActionIcon, Group } from "@mantine/core";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheckbox, IconEdit, IconTrash, IconX } from "@tabler/icons";
import DELETE_TRANSACTION from "../../graphql/mutations/delete-transaction";
import UPDATE_TRANSACTION from "../../graphql/mutations/update-transaction";
import GET_ME from "../../graphql/queries/get-me";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../graphql/queries/get-transactions-from-account";
import { Transaction, TransactionDetail, UpdateTransactionInput } from "../../graphql/__generated__/graphql";
import EditTransactionModal from "./edit-transaction-modal";

export default function TransactionRow({ transaction }: { transaction: Transaction }) {
  const date = new Date(Date.parse(transaction.date)).toLocaleDateString("en-GB");
  const [deleteTransactionMutation, { loading: loadingDelete }] = useMutation(DELETE_TRANSACTION);
  const [updateTransactionMutation, { loading: loadingUpdate, client: updateClient }] = useMutation(UPDATE_TRANSACTION);
  const transactionDetails = transaction.transactionDetails;

  const aggregateTransactionDetail: TransactionDetail = {
    amount: transactionDetails.reduce((accum, transaction) => accum + transaction.amount, 0),
    category: transactionDetails[0].category,
    payee: transactionDetails[0].payee,
  };

  const handleClearTransaction = (transactionToUpdate: Transaction, accountId: string) => {
    const { __typename, _id, ...typenameRemoved } = transactionToUpdate;

    const transaction: UpdateTransactionInput = {
      ...typenameRemoved,
      id: transactionToUpdate._id,
      cleared: !typenameRemoved.cleared,
      transactionDetails: typenameRemoved.transactionDetails.map(detail => {
        const { __typename, ...removed } = detail;
        return removed;
      }),
    };

    updateTransactionMutation({
      variables: { transaction },
      onError: error => {
        showNotification({
          title: "Failed to clear transactions",
          message: `${error.graphQLErrors[0].message}`,
          color: "red",
          icon: <IconX />,
        });
      },
      refetchQueries: [{ query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId: accountId } }],
    });
  };

  const openDeleteTransactionModal = (transactionId: string, accountId: string) =>
    openConfirmModal({
      title: "Are you sure you want to delete this transaction?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "dark" },
      onCancel: () => console.log(`Cancelled deleting ${transactionId}`),
      onConfirm: () => {
        deleteTransactionMutation({
          variables: { transactionId, accountId },
          onCompleted: _data => {
            showNotification({ title: "Removed transaction", message: "Successfully removed transaction to account" });
          },
          onError: error => {
            showNotification({
              title: "Failed to add transaction.",
              message: `${error.graphQLErrors[0].message}`,
              color: "red",
              icon: <IconX />,
            });
          },
          refetchQueries: [
            { query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId: accountId } },
            { query: GET_ME },
          ],
        });
      },
    });

  const handleEditTransaction = (transaction: Transaction) => {
    openContextModal({
      modal: "editTransaction",
      title: "Edit Transaction",
      innerProps: { transaction },
    });
  };

  const payeeColumn = aggregateTransactionDetail.payee;
  const categoryColumn =
    aggregateTransactionDetail.category === "Reconciler" ? "" : aggregateTransactionDetail.category;

  return (
    <tr key={transaction._id}>
      <td>{date}</td>
      <td>{payeeColumn}</td>
      <td>{categoryColumn}</td>
      <td>{aggregateTransactionDetail.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
      <td>
        <Group spacing={4}>
          <ActionIcon
            disabled={transaction.transactionDetails[0].category === "Reconciler"}
            onClick={() => handleEditTransaction(transaction)}
            variant="default">
            <IconEdit size={18} />
          </ActionIcon>
          <ActionIcon
            disabled={transaction.transactionDetails[0].category === "Reconciler" || transaction.reconciled}
            onClick={() => handleClearTransaction(transaction, transaction.account)}
            variant={transaction.reconciled ? "light" : transaction.cleared ? "filled" : "default"}>
            <IconCheckbox size={18} />
          </ActionIcon>
          <ActionIcon
            onClick={() => openDeleteTransactionModal(transaction._id, transaction.account)}
            variant="default">
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  );
}
