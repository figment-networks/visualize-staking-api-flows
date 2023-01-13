// @ts-nocheck
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import styles from "@styles/Home.module.css";

export default function Footer() {
  const router = useRouter();
  const [isIndexPage, setIsIndexPage] = useState(false);

  useEffect(() => {
    setIsIndexPage(router.pathname === "/" ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <footer>
        <a href="https://figment.io" target="_blank" rel="noopener noreferrer">
          Figment.io
        </a>
        {isIndexPage && (
          <Image
            src="/f.svg"
            alt="Figment Logo"
            width={64}
            height={24}
            className={styles.logo}
          />
        )}
        {!isIndexPage && (
          <Button
            type="text"
            size="large"
            href="/"
            icon={<HomeOutlined />}
            style={{
              fontSize: "1rem",
              marginRight: "25px",
              marginLeft: "25px",
            }}
          >
            Main Page
          </Button>
        )}
        <a
          href="https://docs.figment.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Figment Docs
        </a>
      </footer>
    </>
  );
}
