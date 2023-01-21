import { Account } from "../../graphql/__generated__/graphql";
import { ContextModalProps } from "@mantine/modals";
import { useMutation } from "@apollo/client";
import EDIT_ACCOUNT from "../../graphql/mutations/edit-account";
import { FormErrors, useForm } from "@mantine/form";
import AccountModalLayout, { AccountModalInputBase } from "./account-modal-layout";
import { FormEvent } from "react";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import GET_ME from "../../graphql/queries/get-me";

type EditAccountModalProps = {
  account: Account;
};

const EditAccountModal = ({ context, id, innerProps }: ContextModalProps<EditAccountModalProps>) => {
  const { account } = innerProps;
  const [editAccountMutation, { loading }] = useMutation(EDIT_ACCOUNT);

  const form = useForm<AccountModalInputBase>({
    initialValues: {
      name: account.name,
      type: account.type as AccountModalInputBase["type"],
      balance: account.balance.toString(),
      currency: account.currency,
    },
  });

  const editAccount = (values: AccountModalInputBase, _event: FormEvent<HTMLFormElement>) => {
    void editAccountMutation({
      variables: { input: { _id: account._id, name: values.name } },
      onCompleted: (data) => {
        showNotification({
          title: "Successfully edited account",
          message: `${data.editAccount.name} added!`,
        });
        context.closeModal(id);
        form.reset();
      },
      onError: (error) => {
        showNotification({
          title: "Failed to edit account.",
          message: `${error.graphQLErrors[0].message}`,
          color: "red",
          icon: <IconX />,
        });
        form.reset();
      },
      refetchQueries: [{ query: GET_ME }],
    });
  };

  const validateInfo = (
    validationErrors: FormErrors,
    _values: AccountModalInputBase,
    _event: FormEvent<HTMLFormElement>
  ) => {
    console.log(validationErrors);
  };

  return (
    <AccountModalLayout
      loading={loading}
      form={form}
      submitHandler={editAccount}
      validateInfo={validateInfo}
      edit={true}
      context={context}
      modalId={id}
      account={account}
    />
  );
};

export default EditAccountModal;
