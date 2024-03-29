import { useEffect, useState } from "react";

interface Prop {
  children?: any;
  delegated?: {
    [x: string]: any;
  };
}

export default function ClientOnly({ children, ...delegated }: Prop) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}
