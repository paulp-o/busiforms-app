"use client";

import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserDetails, getUserDetailsQueryKey, updateUserDetails } from "../queries";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { IconPencilX } from "@tabler/icons-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  nickname: z.string().min(1, "닉네임은 필수입니다."),
  name: z.string().min(1, "이름은 필수입니다."),
  // phone: z.string().min(1, "전화번호를 입력해주세요."),
});

export default function ProfilePage({ dehydratedState, session }: { dehydratedState: unknown; session: any }) {
  const queryClient = useQueryClient();

  const { data: userDetails } = useSuspenseQuery({
    queryKey: getUserDetailsQueryKey(session.user?.id as string),
    queryFn: () => fetchUserDetails(session.user?.id as string),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: userDetails.nickname || "",
      name: userDetails.name || "",
      phone: userDetails.phone || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (userDetails: { name?: string; phone?: string; nickname?: string }) => updateUserDetails(session.user?.id as string, userDetails),
    onMutate: async (newDetails) => {
      await queryClient.cancelQueries({ queryKey: getUserDetailsQueryKey(session.user?.id as string) });

      const previousDetails = queryClient.getQueryData(getUserDetailsQueryKey(session.user?.id as string));

      queryClient.setQueryData(getUserDetailsQueryKey(session.user?.id as string), (old: any) => ({
        ...old,
        ...newDetails,
      }));

      return { previousDetails };
    },
    onError: (err, newDetails, context) => {
      queryClient.setQueryData(getUserDetailsQueryKey(session.user?.id as string), context?.previousDetails);
      toast.error("업데이트에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getUserDetailsQueryKey(session.user?.id as string) });
    },
    onSuccess: () => {
      toast.success("저장되었습니다.");
      console.log("updated user details");
    },
  });

  const onSubmit = (data: { name: string; phone: string; nickname: string }) => {
    const changes = Object.keys(data).reduce((acc, key) => {
      if (data[key as keyof typeof data] !== userDetails[key as keyof typeof userDetails]) {
        acc[key as keyof typeof data] = data[key as keyof typeof data];
      }
      return acc;
    }, {} as { name?: string; phone?: string; nickname?: string });

    if (Object.keys(changes).length > 0) {
      console.log("submitting changes", changes);
      mutation.mutate(changes);
    } else {
      toast("변경된 내용이 없습니다.", { icon: <IconPencilX /> });
    }
  };

  const handleValidationErrors = () => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean)
      .join("\n");
    if (errorMessages) {
      toast.error(errorMessages);
    }
  };

  return (
    <div>
      <Toaster position="bottom-right" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="container max-w-screen-lg p-4 justify-items-center place-self-center">
          <h1 className="text-2xl font-bold mb-12">나의 프로필</h1>
          <form onSubmit={handleSubmit(onSubmit, handleValidationErrors)} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex justify-center">
              <div className="w-32 rounded-full">
                {session.user?.image ? (
                  <img src={session?.user?.image || ""} className="rounded-full w-32 h-32" />
                ) : (
                  <span className="text-3xl">D</span>
                )}
              </div>
            </div>
            <div className="font-semibold">이메일</div>
            <div>
              <div>{session.user?.email}</div>
            </div>
            <div className="font-semibold">닉네임</div>
            <div>
              <input type="text" className="input input-sm input-bordered w-full" {...register("nickname")} placeholder="입력해주세요" />
            </div>
            <div className="font-semibold">이름</div>
            <div>
              <input type="text" className="input input-sm input-bordered w-full" {...register("name")} placeholder="입력해주세요" />
            </div>
            <div className="font-semibold">전화번호</div>
            <div>
              <input type="tel" className="input input-sm input-bordered w-full" {...register("phone")} placeholder="입력해주세요" />
            </div>
            {/* <div className="font-semibold">로그인 방식</div>
            <div> */}
            <div className="font-semibold">가입일자</div>
            <div>2023-01-01</div>
            <div className="col-span-2 w-full mt-8 flex justify-center">
              <button type="submit" className="btn btn-sm btn-wide" disabled={mutation.isPending}>
                {mutation.isPending ? <span className="loading loading-spinner loading-sm"></span> : "저장하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
