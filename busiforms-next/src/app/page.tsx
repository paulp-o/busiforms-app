"use client";
import Button from "@/components/common/Button/Button";
import { Container } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <Container>
      <h1>Welcome to BusiForms</h1>
      <Button onClick={() => redirect("/auth/login")}>Login</Button>
    </Container>
  );
}
