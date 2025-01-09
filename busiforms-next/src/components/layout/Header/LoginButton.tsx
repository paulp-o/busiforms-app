import React from "react";
import Link from "next/link";
import Button from "@/components/common/Button/Button";
const LoginButton: React.FC = () => {
  return (
    <Link href="/auth/login">
      <Button>Login</Button>
    </Link>
  );
};

export default LoginButton;
