import { FormEvent } from "react";
import { FormErrors, useForm } from "@mantine/form";
import { useMutation } from "@apollo/client";
import ADD_ACCOUNT from "../../graphql/mutations/add-account";
import GET_ME from "../../graphql/queries/get-me";
import { showNotification } from "@mantine/notifications";
import { ContextModalProps } from "@mantine/modals";
import { IconX } from "@tabler/icons";
import AccountModalLayout, { AccountModalInputBase } from "./account-modal-layout";

type AddAccountModalProps = {};

const AddAccountModal = ({ context, id, innerProps }: ContextModalProps<AddAccountModalProps>) => {
  const [addAccountMutation, { loading }] = useMutation(ADD_ACCOUNT);

  const form = useForm<AccountModalInputBase>({
    initialValues: {
      name: "",
      type: "checking",
      balance: "0.00",
      currency: "CAD",
    },
    validate: {
      name: (value) => (value.length < 3 ? "Account name must be longer than 3 characters" : null),
      balance: (value) => {
        const floatValue = parseFloat(value);
        return value === undefined ? "Must have an amount" : isNaN(floatValue) ? "Amount must be a number" : null;
      },
    },
  });

  const addAccount = (values: AccountModalInputBase, _event: FormEvent<HTMLFormElement>) => {
    void addAccountMutation({
      variables: {
        input: { name: values.name, type: values.type, balance: parseFloat(values.balance) },
      },
      onCompleted: (data) => {
        showNotification({
          title: "Successfully added account",
          message: `${data.addAccount.name} added!`,
        });
        context.closeModal(id);
        form.reset();
      },
      onError: (error) => {
        showNotification({
          title: "Failed to add account.",
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
      submitHandler={addAccount}
      validateInfo={validateInfo}
      edit={false}
      context={context}
      modalId={id}
    />
  );
};

export default AddAccountModal;
