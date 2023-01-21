import { Button, Menu } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons";
import { ReactElement } from "react";
import Landing from "../components/landing";
import type { NextPageWithLayout } from "./_app";

const Form = () => {
  return (
    <form>
      <input></input>
    </form>
  );
};

const Index: NextPageWithLayout = () => {
  return (
    <Menu width={200} shadow="md">
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item component={Form}>Mantine website</Menu.Item>

        <Menu.Item icon={<IconExternalLink size={14} />} component="a" href="https://mantine.dev" target="_blank">
          External link
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};

export default Index;
