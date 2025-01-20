"use client";

import { IconRefresh } from "@tabler/icons-react";
import { fetchSurveys, getSurveysQueryKey } from "../queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function RefreshMyFormsButtonComponent({ userId }: { userId: string }) {
  const {
    data: surveys,
    isLoading,
    isError,
    refetch,
  } = useSuspenseQuery({
    queryKey: getSurveysQueryKey(userId),
    queryFn: () => fetchSurveys(userId),
  });
  return (
    <button className="btn btn-sm btn-primary btn-outline" onClick={() => refetch()} disabled={isLoading}>
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <>
          새로 고침
          <IconRefresh />
        </>
      )}
    </button>
  );
}
