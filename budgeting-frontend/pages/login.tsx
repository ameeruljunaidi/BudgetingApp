import { Button, Center, Group, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { FormEvent } from "react";
import { LoginInput } from "../graphql/__generated__/graphql";
import { useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import LOGIN from "../graphql/mutations/login";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";

export default function Login() {
  const { height, width } = useViewportSize();
  const router = useRouter();

  const form = useForm<LoginInput>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const [login] = useMutation(LOGIN);

  const logIn = (values: LoginInput, _event: FormEvent<HTMLFormElement>) => {
    const { email, password } = values;

    login({
      variables: { input: { email, password } },
      onCompleted: data => {
        if (data.login) {
          router.push("/shell/home");
        } else {
          showNotification({
            title: "Failed to login",
            message: "Failed to login",
            color: "red",
            icon: <IconX />,
          });
          form.reset();
        }
      },
      onError: error => {
        if (error.graphQLErrors[0].message) {
          showNotification({
            title: "Failed to login",
            message: `${error.graphQLErrors[0].message}`,
            color: "red",
            icon: <IconX />,
          });
        } else {
          console.error(error);
        }
        form.reset();
      },
    });
  };

  const validateInfo = (validationErrors: FormErrors, _values: LoginInput, _event: FormEvent<HTMLFormElement>) => {
    console.log(validationErrors);
  };

  return (
    <Center h={height} w={width} bg="dark">
      <Paper p="lg" pt="xl" my="xl" w={460} bg="white" h={460} radius="md" withBorder shadow="md">
        <Text p={20} pb={30} ta="center" weight={700} size="xl">
          Budgeting App
        </Text>
        <form onSubmit={form.onSubmit(logIn, validateInfo)} onReset={form.onReset}>
          <TextInput p="xs" pb={0} label="Email" placeholder="your@email.com" {...form.getInputProps("email")} />
          <PasswordInput p="xs" label="Password" placeholder="Your Password" {...form.getInputProps("password")} />
          <Group position="right" mt="md">
            <Button component={Link} href="/shell/home" bg="black">
              Continue
            </Button>
            <Button type="submit" bg="black" mr="xs">
              Submit
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
