// @ts-nocheck
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";

export default function Footer() {
  const router = useRouter();
  const [isIndexPage, setIsIndexPage] = useState(false);

  useEffect(() => {
    setIsIndexPage(router.pathname === "/" ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        <style jsx>{`
          div {
            position: fixed;
            bottom: 0;
            width: 100%;
            min-height: 50px;
            max-height: 50px;
            font-size: 1.8rem;
            font-weight: bold;
            border-top: 1px solid #024c76;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            background: rgba(255, 255, 255, 0.9);
          }

          a:visited {
            color: #000;
          }

          a:hover {
            color: #024c76;
          }
        `}</style>

        <a href="https://figment.io" target="_blank" rel="noopener noreferrer">
          Figment.io
        </a>

        {isIndexPage && (
          <Image src="/f.svg" alt="Figment Logo" width={64} height={32} />
        )}

        {!isIndexPage && (
          <Button
            type="text"
            size="large"
            href="/"
            icon={<HomeOutlined />}
            style={{
              fontSize: "1.6rem",
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
      </div>
    </>
  );
}
