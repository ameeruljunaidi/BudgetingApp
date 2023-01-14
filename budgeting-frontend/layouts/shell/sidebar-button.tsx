import { Collapse } from "@mantine/core";
import shellStyle from "../../styles/shell.style";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

type SidebarButtonProps = {
  buttonLink: { link: string; name: string };
  collapsibleFn?: () => void;
  openCollapsible?: boolean;
  collapsibleElem?: JSX.Element[];
  setSidebarOpened: Dispatch<SetStateAction<boolean>>;
};

export default function SidebarButton({
  buttonLink,
  collapsibleFn,
  openCollapsible,
  collapsibleElem,
  setSidebarOpened,
}: SidebarButtonProps) {
  const router = useRouter();
  const currentPath = router.asPath.split("/")[2];
  const [activeSelection, setActiveSelection] = useState(currentPath);
  const { cx, classes } = shellStyle();
  const { link, name } = buttonLink;
  const nameLowerCase = name.toLocaleLowerCase();

  return (
    <div key={link}>
      <a
        className={cx(classes.link, {
          [classes.linkActive]: nameLowerCase === currentPath && nameLowerCase === activeSelection,
        })}
        href={link}
        onClick={(event) => {
          event.preventDefault();
          setActiveSelection(nameLowerCase);
          setSidebarOpened((prev) => !prev);
          collapsibleFn && collapsibleFn();
          if (!collapsibleFn) router.push(link);
        }}
      >
        <span>{name}</span>
      </a>
      <Collapse in={openCollapsible ?? false}>{collapsibleElem}</Collapse>
    </div>
  );
}
