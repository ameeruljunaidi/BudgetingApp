import { useMutation } from "@apollo/client";
import { FormErrors, useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { FormEvent, useContext } from "react";
import UPDATE_TRANSACTION from "../../graphql/mutations/update-transaction";
import GET_ME from "../../graphql/queries/get-me";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../graphql/queries/get-transactions-from-account";
import { Account, Transaction, UpdateTransactionInput } from "../../graphql/__generated__/graphql";
import { UserContext } from "../../layouts/shell";
import TransactionModalLayout, { TransactionModalInputBase } from "./transaction-modal-layout";
import { useToggle } from "@mantine/hooks";

export type EditTransactionModalProps = {
  transaction: Transaction;
  account: Account;
};

export default function EditModal({ context, id, innerProps }: ContextModalProps<EditTransactionModalProps>) {
  const user = useContext(UserContext);
  if (!user) throw new Error("User must be logged in");
  const [flow, toggleFlow] = useToggle(["-", "+"] as const);
  const { transaction, account } = innerProps;
  const [updateTransactionMutation, { loading }] = useMutation(UPDATE_TRANSACTION);

  const form = useForm<TransactionModalInputBase>({
    initialValues: {
      date: new Date(Date.parse(transaction.date)),
      amount: Math.abs(transaction.transactionDetails[0].amount).toString(),
      category: transaction.transactionDetails[0].category,
      payee: transaction.transactionDetails[0].payee,
    },
    validate: {
      amount: (value) => {
        const floatValue = parseFloat(value);
        return value === undefined
          ? "Must have an amount"
          : isNaN(floatValue)
          ? "Amount must be a number"
          : floatValue == 0
          ? "Amount must be non-zero"
          : null;
      },
    },
  });

  const updateTransaction = (values: TransactionModalInputBase, _event: FormEvent<HTMLFormElement>) => {
    if (!user) {
      form.reset();
      context.closeModal(id);
      showNotification({
        title: "Failed to add transaction.",
        message: "Could not find user on file.",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    const account = user.accounts.find((account) => account?._id === transaction.account); // Will throw error if not found

    if (!account) {
      form.reset();
      context.closeModal(id);
      showNotification({
        title: "Failed to add transaction.",
        message: "Could not find account.",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    const updatedTransaction: UpdateTransactionInput = {
      id: transaction._id,
      date: values.date,
      account: transaction.account,
      approved: true,
      currency: account.currency ?? "CAD",
      reconciled: false,
      scheduled: false,
      cleared: false,
      scheduledDates: transaction.scheduledDates,
      transactionDetails: [
        {
          amount: flow === "-" ? -parseFloat(values.amount) : parseFloat(values.amount),
          category: values.category,
          payee: values.payee,
        },
      ],
    };

    void updateTransactionMutation({
      variables: { transaction: updatedTransaction },
      refetchQueries: [
        { query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId: transaction.account } },
        { query: GET_ME },
      ],
      onCompleted: (_data) => {
        showNotification({ title: "Updated transaction", message: "Successfully updated transaction" });
      },
      onError: (error) => {
        showNotification({
          title: "Failed to update transaction.",
          message: `${error.graphQLErrors[0].message}`,
          color: "red",
          icon: <IconX />,
        });
      },
    });

    form.reset();
    context.closeModal(id);
  };

  const validateInfo = (
    validationErrors: FormErrors,
    _values: TransactionModalInputBase,
    _event: FormEvent<HTMLFormElement>
  ) => {
    console.log(validationErrors);
  };

  return (
    <TransactionModalLayout
      loading={loading}
      form={form}
      submitHandler={updateTransaction}
      validateInfo={validateInfo}
      account={account}
      user={user}
      onDateChange={(value) => form.setFieldValue("date", value)}
      flow={flow}
      toggleFlow={toggleFlow}
    />
  );
}
