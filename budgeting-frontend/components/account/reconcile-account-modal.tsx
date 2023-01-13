import { useMutation } from "@apollo/client";
import { Button, LoadingOverlay, Space, TextInput } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { FormEvent, useContext } from "react";
import RECONCILE_ACCOUNT from "../../graphql/mutations/reconcile-account";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../graphql/queries/get-transactions-from-account";
import { Transaction } from "../../graphql/__generated__/graphql";
import { UserContext } from "../../layouts/shell";

type ReconcileAccountModalProps = {
  accountId: string;
  transactions: Transaction[];
};

export default function ReconcileAccountModal({
  context,
  id,
  innerProps,
}: ContextModalProps<ReconcileAccountModalProps>) {
  const [reconcileAccountMutation, { loading }] = useMutation(RECONCILE_ACCOUNT);
  const { accountId, transactions } = innerProps;

  const clearedBalance = transactions.reduce(
    (total, transaction) =>
      total +
      (transaction.cleared
        ? transaction.transactionDetails.reduce((current, detail) => current + detail.amount, 0)
        : 0),
    0
  );

  type FormInput = {
    newBalance: number;
  };

  const form = useForm({
    initialValues: {
      newBalance: clearedBalance,
    },
    validate: {
      newBalance: value => (isNaN(value) ? "Balance must be a number" : null),
    },
  });

  const reconcileAccount = (values: FormInput, _event: FormEvent<HTMLFormElement>) => {
    const { newBalance: rawBalance } = values;

    // prettier-ignore
    const newBalance = !rawBalance ? 0
    : isNaN(rawBalance) ? 0
    : typeof rawBalance === "string" ? parseInt(rawBalance)
    : rawBalance;

    reconcileAccountMutation({
      variables: { accountId, newBalance },
      onCompleted: data => {
        showNotification({
          title: "Successfully reconciled account",
          message: `${data.reconcileAccount.name} reconciled!`,
        });
        context.closeModal(id);
      },
      onError: error => {
        showNotification({
          title: "Failed to reconcile account",
          message: `${error.graphQLErrors[0].message}`,
          color: "red",
          icon: <IconX />,
        });
      },
      refetchQueries: [{ query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId } }],
    });
  };

  const validateInfo = (validationErrors: FormErrors, _values: FormInput, _event: FormEvent<HTMLFormElement>) => {
    console.log(validationErrors);
  };

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <form onSubmit={form.onSubmit(reconcileAccount, validateInfo)}>
        <TextInput
          type="number"
          placeholder="Current Account Balance"
          label="Current Account Balance"
          {...form.getInputProps("newBalance")}
        />
        <Space h="xs" />
        <Button bg="black" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
