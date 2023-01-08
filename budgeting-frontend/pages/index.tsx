import { DatePicker } from "@mantine/dates";
import { ReactElement, useState } from "react";
import Landing from "../components/landing";
import type { NextPageWithLayout } from "./_app";

const Index: NextPageWithLayout = () => {
  const [value, onChange] = useState<Date | null>(new Date());

  console.log(value?.toISOString());

  return <DatePicker value={value} onChange={onChange} />;
  // return <div>Landing Page</div>;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};

export default Index;
