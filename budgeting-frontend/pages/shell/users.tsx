import type { ReactElement, ReactNode } from "react";
import Shell from "../../layouts/shell";
import { UsersRolesTable } from "../../components/users-table";
import { GetUsersDocument, User } from "../../graphql/__generated__/graphql";
import client from "../../lib/apollo-client";
import type { NextPageWithLayout } from "../_app";

export async function getStaticProps() {
  const { data } = await client.query({
    query: GetUsersDocument,
  });

  return {
    props: {
      users: data.getUsers,
    },
  };
}

const Users: NextPageWithLayout<{ users: User[] }> = ({ users }) => {
  const data = users.map(user => {
    return { avatar: "", name: user.name, email: user.email, role: user.role };
  });

  return <UsersRolesTable data={data} />;
};

Users.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Users;
