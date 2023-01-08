import { Avatar, Badge, Table, Group, Text, Select, ScrollArea } from "@mantine/core";

interface UsersTableProps {
  data: { avatar: string; name: string; email: string; role: string }[];
}

export function UsersRolesTable({ data }: UsersTableProps) {
  const rows = data.map(item => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} src={item.avatar} radius={40} />
          <div>
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
            <Text size="xs" color="dimmed">
              {item.email}
            </Text>
          </div>
        </Group>
      </td>

      <td>
        <Text tt="capitalize" size="sm" weight={500}>
          {item.role}
        </Text>
        {/* <Select data={rolesData} defaultValue={item.role} variant="unstyled" /> */}
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            <th>Users</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
