import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Popover,
  Select,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FormErrors, useForm, UseFormReturnType } from "@mantine/form";
import { IconCirclePlus, IconX } from "@tabler/icons";
import { FormEvent, SetStateAction, useState } from "react";
import { Account, Scalars, User } from "../../graphql/__generated__/graphql";
import { useMutation } from "@apollo/client";
import ADD_CATEGORY from "../../graphql/mutations/add-category";
import { showNotification } from "@mantine/notifications";
import GET_ME from "../../graphql/queries/get-me";
import { useClickOutside, useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  selected: {
    color: `${theme.white} !important`,
    backgroundColor: `${theme.black} !important`,
  },
}));

type TransactionModalLayoutProps<T> = {
  loading: boolean;
  form: UseFormReturnType<T, (values: T) => T>;
  submitHandler: (values: T, _event: FormEvent<HTMLFormElement>) => void;
  validateInfo: (validationErrors: FormErrors, _values: T, _event: FormEvent<HTMLFormElement>) => void;
  account: Account;
  user: User;
  onDateChange: (value: Date | null) => void;
  flow: "-" | "+";
  toggleFlow: (value?: SetStateAction<"-" | "+"> | undefined) => void;
};

type SelectType = {
  value: string;
  label: string;
};

type SelectGroupType = {
  value: string;
  label: string;
  group: string;
};

export type TransactionModalInputBase = {
  date: Scalars["DateTime"];
  amount: string;
  category: string;
  payee: string;
};

type AddCategoryInput = {
  category: string;
  categoryGroup: string;
};

const TransactionModalLayout = <T extends TransactionModalInputBase>({
  loading,
  form,
  submitHandler,
  validateInfo,
  account,
  user,
  onDateChange,
  flow,
  toggleFlow,
}: TransactionModalLayoutProps<T>) => {
  const { classes, cx } = useStyles();
  const [payees, setPayees] = useState<SelectType[]>(user.payees.map((payee) => ({ value: payee, label: payee })));
  const [categories, setCategories] = useState<SelectGroupType[]>(
    user.categoryGroups.flatMap((group) =>
      group.categories.map((category) => ({ value: category, label: category, group: group.categoryGroup }))
    )
  );
  const [categoryGroups, setCategoryGroups] = useState<SelectType[]>(
    user.categoryGroups.map((group) => ({ value: group.categoryGroup, label: group.categoryGroup }))
  );
  const [addCategoryMutation, { loading: categoryLoading }] = useMutation(ADD_CATEGORY);
  const [addCategoryOpened, { close: closeAddCategory, open: openAddCategory }] = useDisclosure(false);
  const addCategoryRef = useClickOutside(() => closeAddCategory());

  const categoryForm = useForm<AddCategoryInput>({
    initialValues: {
      category: "",
      categoryGroup: "",
    },
    validate: {
      category: (value) => (value === "" ? "Category cannot be empty" : null),
      categoryGroup: (value) => (value === "" ? "Category group cannot be empty" : null),
    },
  });

  const handleAddCategory = (values: AddCategoryInput) => {
    categoryForm.validate();

    if (!categoryForm.isValid()) return;

    void addCategoryMutation({
      variables: { category: values.category, categoryGroup: values.categoryGroup },
      onCompleted: () => {
        closeAddCategory();
        setCategories((prev) =>
          prev.concat({ value: values.category, label: values.category, group: values.categoryGroup })
        );
        showNotification({
          title: "Sucessfully added category.",
          message: "Category can now be used.",
        });
      },
      onError: (error) => {
        showNotification({
          title: "Failed to add category.",
          message: `${error.graphQLErrors[0].message}`,
          color: "red",
          icon: <IconX />,
        });
      },
      refetchQueries: [{ query: GET_ME }],
    });
  };

  return (
    <>
      <LoadingOverlay visible={loading || categoryLoading} overlayBlur={2} />
      <form onSubmit={form.onSubmit(submitHandler, validateInfo)}>
        <Flex justify="space-between" align="flex-end" wrap="nowrap" gap="sm">
          <DatePicker
            value={form.values.date}
            onChange={onDateChange}
            placeholder="Pick a date"
            label="Date"
            firstDayOfWeek="sunday"
            dayClassName={(date, modifiers) =>
              cx({
                [classes.selected]: modifiers.selected,
              })
            }
          />
          <Select
            {...form.getInputProps("payee")}
            label="Payee"
            placeholder="Choose or add."
            data={payees.filter((payee) => payee.value !== "Reconciler")}
            clearable
            allowDeselect
            nothingFound="Nothing found. Try adding one."
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setPayees((current) => [...current, item]);
              return item;
            }}
          />
          <Group spacing="xs" align="flex-end" noWrap>
            <Select
              {...form.getInputProps("category")}
              label="Category"
              placeholder="Choose or add."
              data={categories.filter((category) => category.value !== "Reconciler")}
              clearable
              allowDeselect
              searchable
              nothingFound="Nothing found."
            />
            <Box ref={addCategoryRef}>
              <Popover width={300} trapFocus position="bottom" withArrow shadow="md" opened={addCategoryOpened}>
                <Popover.Target>
                  <Tooltip label="Add a category group/category.">
                    <ActionIcon mb={4} onClick={() => openAddCategory()}>
                      <IconCirclePlus />
                    </ActionIcon>
                  </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                  <LoadingOverlay visible={loading || categoryLoading} overlayBlur={2} />
                  <Stack spacing="sm">
                    <TextInput
                      {...categoryForm.getInputProps("category")}
                      label="New Category"
                      placeholder="New Category"
                    ></TextInput>
                    <Select
                      {...categoryForm.getInputProps("categoryGroup")}
                      data={categoryGroups.filter((group) => group.value !== "Reconciler")}
                      label="In Category Group"
                      placeholder="Choose or add."
                      clearable
                      allowDeselect
                      searchable
                      nothingFound="Nothing found."
                      creatable
                      getCreateLabel={(query) => `+ Create ${query}`}
                      onCreate={(query) => {
                        const item = { value: query, label: query };
                        setCategoryGroups((current) => [...current, item]);
                        return item;
                      }}
                    ></Select>
                    <Flex justify="space-evenly">
                      <Button bg="gray" onClick={() => closeAddCategory()}>
                        Cancel
                      </Button>
                      <Button bg="black" onClick={() => handleAddCategory(categoryForm.values)}>
                        Submit
                      </Button>
                    </Flex>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            </Box>
          </Group>
          <Group align="flex-end" noWrap spacing={2}>
            <Tooltip label="Switch inflow/outflow.">
              <Button w={50} onClick={() => toggleFlow()} color={flow === "+" ? "blue" : "red"} type="button">
                {flow}
              </Button>
            </Tooltip>
            <TextInput {...form.getInputProps("amount")} label={`Amount (${account.currency})`} />
          </Group>
          <Button bg="black" type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default TransactionModalLayout;
