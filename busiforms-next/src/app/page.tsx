"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

function Background() {
  return <div className={styles.background}>{/* You can put something here */}</div>;
}

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundWrapper}>
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <Background />
          </motion.div>
        </AuroraBackground>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.backgroundCircle} />
          <div className={styles.logo}>
            <Image src="/images/mainlogo.svg" alt="BusiForm Logo" width={300} height={75} priority />
          </div>

          <div className={styles.textContent}>
            <p className={styles.koreanText}>하품하고 기지개 한 번 피면,</p>
            <p className={styles.koreanTextBold}>설문과 분석이 끝나있다!</p>
          </div>

          <Link href="/auth/login">
            <Button variant="solid" size="lg" className={styles.loginButton}>
              시작하기!
            </Button>
          </Link>

          <div className={styles.characterImage}>
            <Image src="/images/ch-with-form.png" alt="Character with form" width={1200} height={1200} priority />
          </div>
        </div>
      </div>
    </div>
  );
}
