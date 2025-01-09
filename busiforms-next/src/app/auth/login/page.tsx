"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/common/Input/Input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Card, Flex, Stack } from "@chakra-ui/react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await login(formData.get("email") as string, formData.get("password") as string);

    if (!result.success) {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  }

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/logo.png" alt="BusiForm" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">BusiForms</h2>
        </div>
        <Card.Root>
          <Card.Header>
            <h2 className="text-center text-2xl font-bold">로그인</h2>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Field>
                <Input placeholder="이메일" type="text" name="email" accept="text" />
                <Input placeholder="비밀번호" type="password" name="password" accept="password" />
                {errorMessage}
                <Button type="submit" variant="solid" width="100%" mt={4}>
                  로그인
                </Button>
              </Field>
            </form>
          </Card.Body>
        </Card.Root>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>로그인하면 BusiForm의 모든 기능을 사용할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
