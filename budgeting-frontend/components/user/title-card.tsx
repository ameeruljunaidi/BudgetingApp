import { useContext } from "react";
import { UserContext } from "../../layouts/shell";
import { UserButton } from "./user-button";

export default function TitleCard() {
  const user = useContext(UserContext);
  const avatar = "../../public/images/avatar.svg";

  return <UserButton image={avatar} name={user?.name ?? "No User"} email={user?.email ?? "No Email"} />;
}
