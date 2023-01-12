import { useMutation } from "@apollo/client";
import { Button, Center, createStyles, Loader, Modal, Select, Stack, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FormErrors, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { FormEvent, forwardRef, ReactElement, useContext, useImperativeHandle, useState } from "react";
import ADD_TRANSACTION from "../../graphql/mutations/add-transaction";
import GET_ME from "../../graphql/queries/get-me";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../graphql/queries/get-transactions-from-account";
import { AddTransactionDetailInput, AddTransactionInput, CategoryGroups } from "../../graphql/__generated__/graphql";
import { UserContext } from "../../layouts/shell";

export type AddTransactionModalHandler = {
  toggleOpen: () => void;
};

export type AddTransactionModalProps = {
  children: ReactElement;
  accountId: string;
};

type AddTransactionModalInput = Pick<AddTransactionInput, "date"> &
  Pick<AddTransactionDetailInput, "amount" | "category" | "payee"> & { categoryGroup: string };

const useStyles = createStyles(theme => ({
  selected: {
    color: `${theme.white} !important`,
    backgroundColor: `${theme.black} !important`,
  },
}));

type SelectType = {
  value: string;
  label: string;
};

const AddTransactionModal = forwardRef<AddTransactionModalHandler, AddTransactionModalProps>(
  ({ children, accountId }, refs) => {
    const user = useContext(UserContext);
    if (!user) throw new Error("User must be logged in");

    const [opened, setOpened] = useState(false);
    const { classes, cx } = useStyles();

    const availableCategoryGroups = user.categoryGroups.map(group => ({
      value: group.categoryGroup,
      label: group.categoryGroup,
    }));
    const initialSelectedCategoryGroup = user.categoryGroups[0].categoryGroup;
    const initialAvailableCategories = user.categoryGroups[0].categories.map(category => ({
      value: category,
      label: category,
    }));
    const initialAvailablePayees = user.payees.map(payee => ({ value: payee, label: payee }));

    const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>(initialSelectedCategoryGroup);
    const [availableCategories, setAvailableCategories] = useState<SelectType[]>(initialAvailableCategories);
    const [availablePayees, setPayees] = useState<SelectType[]>(initialAvailablePayees);

    const [addTransactionMutation, { loading }] = useMutation(ADD_TRANSACTION);

    const toggleOpen = () => {
      setOpened(o => !o);
    };

    useImperativeHandle(refs, () => ({
      toggleOpen,
    }));

    const form = useForm<AddTransactionModalInput>({
      initialValues: {
        date: new Date(),
        amount: 0,
        categoryGroup: selectedCategoryGroup,
        category: initialAvailableCategories[0].value,
        payee: availablePayees[0].value,
      },
      validate: {
        amount: value =>
          value === undefined ? "Must have an amount" : isNaN(value) ? "Amount must be a number" : null,
        // categoryGroup: , // TODO: Validate
        // category: , // TODO: Validate
      },
    });

    const addTransaction = (values: AddTransactionModalInput, _event: FormEvent<HTMLFormElement>) => {
      if (!user) {
        form.reset();
        setOpened(o => !o);
        showNotification({
          title: "Failed to add transaction.",
          message: "Could not find user on file.",
          color: "red",
          icon: <IconX />,
        });
        return;
      }

      const account = user.accounts.find(account => account?._id === accountId); // Will throw error if not found

      if (!account) {
        form.reset();
        setOpened(o => !o);
        showNotification({
          title: "Failed to add transaction.",
          message: "Could not find account.",
          color: "red",
          icon: <IconX />,
        });
        return;
      }

      // prettier-ignore
      const parsedAmount = !values.amount ? 0
      : isNaN(values.amount) ? 0
      : typeof values.amount === "string" ? parseInt(values.amount)
      : values.amount;

      const newTransaction: AddTransactionInput = {
        date: values.date,
        account: account.name ?? "",
        approved: true,
        currency: account.currency ?? "CAD",
        reconciled: false,
        scheduled: false,
        cleared: false,
        transactionDetails: [
          {
            amount: parsedAmount,
            category: values.category,
            payee: values.payee,
          },
        ],
      };

      addTransactionMutation({
        variables: { input: newTransaction },
        refetchQueries: [{ query: GET_TRANSACTIONS_FROM_ACCOUNT, variables: { accountId } }, { query: GET_ME }],
        onCompleted: _data => {
          showNotification({ title: "Added transaction", message: "Successfully added transaction to account" });
        },
        onError: error => {
          showNotification({
            title: "Failed to add transaction.",
            message: `${error.graphQLErrors[0].message}`,
            color: "red",
            icon: <IconX />,
          });
        },
      });

      form.reset();
      setOpened(o => !o);
    };

    const validateInfo = (
      validationErrors: FormErrors,
      _values: AddTransactionModalInput,
      _event: FormEvent<HTMLFormElement>
    ) => {
      console.log(validationErrors);
    };

    const handleCategoryGroupChange = (newCategoryGroup: string) => {
      setSelectedCategoryGroup(newCategoryGroup);

      const newCategoryGroupFromUser = user.categoryGroups.find(group => group.categoryGroup === newCategoryGroup);
      if (!newCategoryGroupFromUser) throw new Error("Failed to find category group");

      const newAvailableCategories = newCategoryGroupFromUser.categories.map(category => ({
        value: category,
        label: category,
      }));

      form.setFieldValue("category", "");
      setAvailableCategories(newAvailableCategories);
    };

    return (
      <>
        {children}
        <Modal opened={opened} onClose={() => setOpened(o => !o)} title="Add a transaction" centered>
          {loading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <form onSubmit={form.onSubmit(addTransaction, validateInfo)}>
              <Stack spacing="xs">
                {/* Date */}
                <DatePicker
                  value={form.values.date}
                  onChange={value => form.setFieldValue("date", value)}
                  placeholder="Pick a date"
                  label="Transaction Date"
                  firstDayOfWeek="sunday"
                  dayClassName={(date, modifiers) =>
                    cx({
                      [classes.selected]: modifiers.selected,
                    })
                  }
                />

                {/* Payee */}
                <Select
                  label="Payee"
                  placeholder="Choose A Payee"
                  data={availablePayees}
                  {...form.getInputProps("payee")}
                  nothingFound="Nothing found"
                  searchable
                  creatable
                  getCreateLabel={query => `+ Create ${query}`}
                  onCreate={query => {
                    const item = { value: query, label: query };
                    setPayees(current => [...current, item]);
                    return item;
                  }}
                />

                {/* Category Group */}
                <Select
                  label="Category Group"
                  placeholder="Choose A Category Group"
                  data={availableCategoryGroups}
                  value={selectedCategoryGroup}
                  onChange={handleCategoryGroupChange}
                />

                {/* Category */}
                <Select
                  label="Category"
                  placeholder="Choose A Category"
                  data={availableCategories}
                  {...form.getInputProps("category")}
                />

                {/* Amount */}
                <TextInput type="number" label="Amount" {...form.getInputProps("amount")} />

                <Button bg="black" type="submit">
                  Submit
                </Button>
              </Stack>
            </form>
          )}
        </Modal>
      </>
    );
  }
);

AddTransactionModal.displayName = "AddTransactionModal";

export default AddTransactionModal;
