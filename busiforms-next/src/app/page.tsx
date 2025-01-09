"use client";
import Button from "@/components/common/Button/Button";
import { Container } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <h1>Welcome to BusiForms</h1>
      <Link href="/auth/login">
        <Button>Login</Button>
      </Link>
    </Container>
  );
}
