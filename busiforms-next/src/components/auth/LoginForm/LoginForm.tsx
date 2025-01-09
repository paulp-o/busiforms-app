"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="email"
        placeholder="아이디 또는 이메일"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="rememberMe"
          checked={formData.rememberMe}
          onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
        />
        <label htmlFor="rememberMe">로그인 상태 유지</label>
      </div>
      <Button type="submit">LOGIN</Button>
      <div className={styles.links}>
        <Link href="/register">회원가입</Link>
        <span>|</span>
        <Link href="/find-id">아이디 찾기</Link>
        <span>|</span>
        <Link href="/reset-password">비밀번호 찾기</Link>
      </div>
    </form>
  );
}
