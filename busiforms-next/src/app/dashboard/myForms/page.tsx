"use client";

import { HydrationBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { fetchForms, getFormsQueryKey } from "../queries";
import Link from "next/link";
import { IconChartBar, IconCopy, IconLink } from "@tabler/icons-react";
import { Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function MyFormList({ dehydratedState, userId }: { dehydratedState: unknown; userId: string }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<p>Loading...</p>}>
        <MyFormListContent userId={userId} />
      </Suspense>
    </HydrationBoundary>
  );
}

interface FormProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
}

function MyFormListContent({ userId }: { userId: string }) {
  const {
    data: forms,
    isLoading,
    isError,

    // refetch,
  } = useSuspenseQuery({
    queryKey: getFormsQueryKey(userId),
    queryFn: () => fetchForms(userId),
  });

  if (isLoading) return <p>Loading forms...</p>;
  if (isError) return <p>Error fetching forms.</p>;

  return (
    <div>
      <Toaster position="bottom-right" />
      <ul>
        {/* {forms.map((form: { id: string; title: string; description: string; questions: object[] }) => (
          <li key={form.id}>
            <h2>제목: {form.title}</h2>
            <p>설명: {form.description}</p>
            <p>질문 개수: {form.questions.length}</p>
          </li>
        ))} */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 p-0">
          {forms.map((form: FormProps, index: number) => (
            <div key={index} className="card card-compact bg-base-100 rounded-xl shadow-xl m-3">
              <div className="card-body">
                {/* 제목 정보 */}
                <h2 className="card-title">{form.title}</h2>
                <div className="flex flex-col gap-2">
                  <div className="">{form.description}</div>
                  {/* 일자 정보 */}
                  <div className="flex flex-col flex-wrap justify-between text-slate-500 text-xs">
                    <div className="flex basis-1/2 gap-1">
                      <div className="">생성일:</div>
                      <div>{form.createdAt.split("T")[0]}</div>
                    </div>
                    <div className="flex basis-1/2 gap-1">
                      <div>수정일: </div>
                      <div>{form.updatedAt.split("T")[0]}</div>
                    </div>
                  </div>
                </div>
                {/* in-content buttons */}
                <div className="h-full flex flex-col gap-2 justify-end">
                  <Link href={`/forms/stats/${form.id}`} className="link-primary inline-flex w-min">
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
                    <Link href={`/form/${form.id}`}>
                      <button className="btn btn-sm join-item border-1 border-neutral-content">
                        <IconLink />
                        참가 링크
                      </button>
                    </Link>
                    <button className="btn btn-sm join-item border-1 border-neutral-content" onClick={() => copyFormLink(form)}>
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
function copyFormLink(form: FormProps) {
  toast.success("링크가 복사되었습니다.");
  navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}`);
}
