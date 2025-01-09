"use client";
import Button from "@/components/common/Button/Button";
import Header from "@/components/layout/Header/Header";
import { Container } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container maxW="container.xl" py={10}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to BusiForms</h1>
          <p className="text-lg mb-8">Streamline your business processes with our easy-to-use forms.</p>
          <img src="/images/비지폼 FWQA 1.png" alt="Landing Page" className="mx-auto mb-8" style={{ maxWidth: "50%", height: "auto" }} />
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
