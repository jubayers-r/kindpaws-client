"use client";

import { useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const SHOW_DELAY_MS = 200;

export const NavigationLoading = () => {
  const isFetching = useIsFetching();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (isFetching === 0) {
      timer = setTimeout(() => setShow(false), 0);
    } else {
      timer = setTimeout(() => setShow(true), SHOW_DELAY_MS);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isFetching]);

  return <LoadingScreen isLoading={show} />;
};

export default NavigationLoading;
