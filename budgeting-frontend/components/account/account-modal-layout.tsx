import { Button, Flex, LoadingOverlay, Select, Stack, TextInput, Text } from "@mantine/core";
import { FormErrors, UseFormReturnType } from "@mantine/form";
import { FormEvent } from "react";
import { Account } from "../../graphql/__generated__/graphql";
import { useMutation } from "@apollo/client";
import DELETE_ACCOUNT from "../../graphql/mutations/delete-account";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import rates from "../../utils/rates";
import GET_ME from "../../graphql/queries/get-me";
import { useRouter } from "next/router";
import { openConfirmModal } from "@mantine/modals";

type AccountModalLayoutProps<T> = {
  loading: boolean;
  form: UseFormReturnType<T, (values: T) => T>;
  submitHandler: (values: T, _event: FormEvent<HTMLFormElement>) => void;
  validateInfo: (validationErrors: FormErrors, _values: T, _event: FormEvent<HTMLFormElement>) => void;
  account?: Account;
  edit: boolean;
  context: ModalsContextProps;
  modalId: string;
};

export type AccountModalInputBase = {
  name: string;
  type: "checking" | "credit" | "tracking";
  balance: string;
  currency: string;
};

const accountTypes = ["checking", "credit", "tracking"];

const selections = accountTypes.map((item) => ({
  value: item,
  label: item
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(""),
}));

const AccountModalLayout = <T extends AccountModalInputBase>({
  loading,
  form,
  submitHandler,
  validateInfo,
  account,
  edit,
  context,
  modalId,
}: AccountModalLayoutProps<T>) => {
  const [deleteAccountMutation, { loading: loadingDelete }] = useMutation(DELETE_ACCOUNT);
  const router = useRouter();
  const currentAccountInPath = router.asPath.split("/")[3];

  const handleDeleteAccount = (account?: Account) => {
    if (!account) {
      form.reset();
      context.closeModal(modalId);
      showNotification({
        title: "Failed to add transaction.",
        message: "Could not find account.",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    openConfirmModal({
      title: "Delete Account",
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this account? This action is irreversible.</Text>,
      labels: { confirm: "Delete Account", cancel: "No Don't Delete" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        context.closeModal(modalId);
        void deleteAccountMutation({
          variables: { accountId: account._id.toString() },
          onCompleted: (data) => {
            showNotification({
              title: "Successfully removed account",
              message: `${data.deleteAccount.name} removed!`,
            });
            context.closeModal(modalId);
            if (currentAccountInPath === data.deleteAccount._id) {
              router.push("/shell/home");
            }
          },
          onError: (error) => {
            showNotification({
              title: "Failed to remove account",
              message: `${error.graphQLErrors[0].message}`,
              color: "red",
              icon: <IconX />,
            });
          },
          refetchQueries: [{ query: GET_ME }],
        });
      },
    });
  };

  return (
    <>
      <LoadingOverlay visible={loading || loadingDelete} overlayBlur={2} />
      <form onSubmit={form.onSubmit(submitHandler, validateInfo)}>
        <Stack spacing="xs">
          <TextInput
            type="text"
            placeholder="Name of Your Account"
            label="Account Name"
            {...form.getInputProps("name")}
          />
          <Select
            label="Account Type"
            placeholder="Choose Account Type"
            data={selections}
            {...form.getInputProps("type")}
            disabled={edit}
          />
          <TextInput disabled={edit} label="Account Balance" {...form.getInputProps("balance")} />
          <Select
            {...form.getInputProps("currency")}
            label="Currency"
            data={rates}
            searchable
            nothingFound="Nothing found."
            clearable
            allowDeselect
            size="sm"
            disabled={edit}
          />
          <Flex align="center" justify="space-evenly" pt="sm">
            {edit && (
              <Button bg="red" type="button" onClick={() => handleDeleteAccount(account)}>
                Delete
              </Button>
            )}
            <Button bg="black" type="submit">
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </>
  );
};

export default AccountModalLayout;
