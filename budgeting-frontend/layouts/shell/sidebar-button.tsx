import { Collapse, Group } from "@mantine/core";
import shellStyle from "../../styles/shell.style";
import { useRouter } from "next/router";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { IconChevronRight } from "@tabler/icons";

type SidebarButtonProps = {
  buttonLink: { link: string; name: string };
  collapsibleFn?: () => void;
  openCollapsible?: boolean;
  collapsibleElem?: JSX.Element[];
  setSidebarOpened: Dispatch<SetStateAction<boolean>>;
  children?: ReactElement;
};

export default function SidebarButton({
  buttonLink,
  collapsibleFn,
  openCollapsible,
  collapsibleElem,
  setSidebarOpened,
  children,
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
          if (!collapsibleFn) void router.push(link);
        }}
      >
        <span>{name}</span>
        {collapsibleFn && (
          <IconChevronRight
            className={classes.chevron}
            size={14}
            stroke={1.5}
            style={{
              transform: openCollapsible ? `rotate(${90}deg)` : "none",
            }}
          />
        )}
      </a>
      {children}
      <Collapse in={openCollapsible ?? false}>{collapsibleElem}</Collapse>
    </div>
  );
}
