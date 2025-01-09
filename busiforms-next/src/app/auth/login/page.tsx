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
  const { user, loading, login, register } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    let username = isRegistering ? (formData.get("username") as string) : "";
    if (!username) {
      username = email.split("@")[0];
    }

    const result = isRegistering ? await register(email, password, username) : await login(email, password);

    if (!result.success) {
      setErrorMessage(isRegistering ? "회원가입에 실패했습니다." : "이메일 또는 비밀번호가 올바르지 않습니다.");
    } else if (result.success) {
      router.push("/dashboard");
    }

    setIsRegistering(false);
    setErrorMessage("");
  }

  if (loading) {
    return null;
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
            <h2 className="text-center text-2xl font-bold">{isRegistering ? "회원가입" : "로그인"}</h2>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Field>
                {isRegistering && <Input placeholder="사용자 이름" type="text" name="username" accept="text" />}
                <Input placeholder="이메일" type="text" name="email" accept="text" />
                <Input placeholder="비밀번호" type="password" name="password" accept="password" />
                {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
                <Button type="submit" variant="solid" width="100%" mt={4}>
                  {isRegistering ? "회원가입" : "로그인"}
                </Button>
              </Field>
            </form>
          </Card.Body>
        </Card.Root>
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMessage("");
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isRegistering ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입"}
          </button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>BusiForm의 모든 기능을 사용하실 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
