"use client";

import { HydrationBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { fetchSurveys, getSurveysQueryKey } from "./queries";
import Link from "next/link";
import { IconChartBar, IconCopy, IconLink } from "@tabler/icons-react";
import { Suspense } from "react";

export default function SurveyList({ dehydratedState, userId }: { dehydratedState: unknown; userId: string }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<p>Loading...</p>}>
        <SurveyListContent userId={userId} />
      </Suspense>
    </HydrationBoundary>
  );
}

interface SurveyProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
}

function SurveyListContent({ userId }: { userId: string }) {
  const {
    data: surveys,
    isLoading,
    isError,

    // refetch,
  } = useSuspenseQuery({
    queryKey: getSurveysQueryKey(userId),
    queryFn: () => fetchSurveys(userId),
  });

  if (isLoading) return <p>Loading surveys...</p>;
  if (isError) return <p>Error fetching surveys.</p>;

  return (
    <div>
      <ul>
        {/* {surveys.map((survey: { id: string; title: string; description: string; questions: object[] }) => (
          <li key={survey.id}>
            <h2>제목: {survey.title}</h2>
            <p>설명: {survey.description}</p>
            <p>질문 개수: {survey.questions.length}</p>
          </li>
        ))} */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 p-0">
          {surveys.map((survey: SurveyProps, index: number) => (
            <div key={index} className="card card-compact bg-base-100 rounded-xl shadow-xl m-3">
              <div className="card-body">
                {/* 제목 정보 */}
                <h2 className="card-title">{survey.title}</h2>
                <div className="flex flex-col gap-2">
                  <div className="">{survey.description}</div>
                  {/* 일자 정보 */}
                  <div className="flex flex-col flex-wrap justify-between text-slate-500 text-xs">
                    <div className="flex basis-1/2 gap-1">
                      <div className="">생성일:</div>
                      <div>{survey.createdAt.split("T")[0]}</div>
                    </div>
                    <div className="flex basis-1/2 gap-1">
                      <div>수정일: </div>
                      <div>{survey.updatedAt.split("T")[0]}</div>
                    </div>
                  </div>
                </div>
                {/* in-content buttons */}
                <div className="h-full flex flex-col gap-2 justify-end">
                  <Link href={`/surveys/stats/${survey.id}`} className="link-primary inline-flex w-min">
                    <button className="btn btn-neutral btn-sm">
                      <IconChartBar />
                      통계
                    </button>
                  </Link>
                </div>
                {/* list of horizontal links */}
                {/* divider */}
                <div className="w-full">
                  <div className="divider m-0" />
                </div>
                <div className="card-actions justify-end">
                  {/* action buttons */}
                  <div className="join join-horizontal flex w-full justify-end">
                    <Link href={`/survey/${survey.id}`}>
                      <button className="btn btn-sm join-item border-1 border-neutral-content">
                        <IconLink />
                        참가 링크
                      </button>
                    </Link>
                    <button
                      className="btn btn-sm join-item border-1 border-neutral-content"
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/survey/${survey.id}`)}
                    >
                      <IconCopy />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ul>
    </div>
  );
}
