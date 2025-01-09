'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // TODO: API 호출하여 회원가입 처리
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // if (response.ok) {
      //   router.push('/login');
      // }
      
      // 임시로 회원가입 성공으로 처리
      alert('회원가입이 완료되었습니다.');
      router.push('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        type="text"
        placeholder="이름"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="비밀번호 확인"
        value={formData.passwordConfirm}
        onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
        required
      />
      <Button type="submit">회원가입</Button>
      <div className={styles.links}>
        이미 계정이 있으신가요? <Link href="/login">로그인</Link>
      </div>
    </form>
  );
} 