import { createStyles } from "@mantine/core";

const tableResizerStyle = createStyles((theme) => ({
  resizer: {
    backgroundColor: "rgb(0, 0, 0, 0)",
    padding: "0 0 0 0",
    width: "5px",
    border: "none",
  },
  header: {
    borderLeft: "1px solid gainsboro",
    borderBottom: "1px solid gainsboro",
  },
}));

export default tableResizerStyle;
