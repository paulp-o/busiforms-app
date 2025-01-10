"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (

    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.backgroundCircle} />
        <div className={styles.logo}>
          <Image
            src="/images/mainlogo.svg"
            alt="BusiForm Logo"
            width={300}
            height={75}
            priority
          />
        </div>
        
        <div className={styles.textContent}>
          <p className={styles.koreanText}>하품하고 기지개 한 번 피면,</p>
          <p className={styles.koreanTextBold}>설문과 분석이 끝나있다!</p>
        </div>

        <Link href="/auth/login">
          <Button variant="solid" size="lg" className={styles.loginButton}>
            LOGIN
          </Button>
        </Link>

        <div className={styles.characterImage}>
          <Image
            src="/images/ch-with-form.png"
            alt="Character with form"
            width={1200}
            height={1200}
            priority
          />
        </div>
      </div>
    </div>
  );
}
