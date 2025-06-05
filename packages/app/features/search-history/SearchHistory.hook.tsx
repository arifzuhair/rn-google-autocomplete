import { useAppSelector } from "@/hooks/useStoreHook";
import { useMemo } from "react";

export const useSearchHistory = () => {
  const { history } = useAppSelector(({ places }) => places);

  const hasHistory = useMemo(() => history.length > 0, [history]);

  return { hasHistory, history };
};
