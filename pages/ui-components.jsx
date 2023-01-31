import Image from "next/image";
import Link from "next/link";
import React from "react";

export const PageTitle = ({ title, headline }) => (
  <div>
    <style jsx>{`
      div {
        margin: 4rem 0;
        text-align: center;
      }
    `}</style>
    <h3>{title}</h3>
    {headline && <h5>{headline}</h5>}
  </div>
);

export const Card = ({ children }) => (
  <div>
    <style jsx>{`
      div {
        background-color: #ffffff;
        border: solid 0.1rem #d4d6d4;
        border-radius: 0.8rem;
        max-width: 120rem;
        padding: 1.6rem;
      }
    `}</style>
    {children}
  </div>
);

export const Button = ({ children, desctructive = false, ...props }) => {
  return (
    <button {...props}>
      <style jsx>{`
        button {
          color: #ffffff;
          border: solid 0.2rem;
          background-color: #0e5048;
          border-color: #0e5048;
          ${desctructive ? "border-color: #C01005;" : ""}
          ${desctructive ? "background-color: #C01005;" : ""}
          border-radius: 3.6rem;
          padding: 0.9rem;
          min-width: calc(3.6rem * 3);
          font-weight: 600;
          transition: color 250ms, background-color 250ms;
          cursor: pointer;
        }

        button:hover:not(:active):not(:disabled) {
          color: #0e5048;
          background-color: #ffffff;
          ${desctructive ? "color: #C01005;" : ""}
        }

        button:disabled {
          border-color: #efefef;
          background-color: #efefef;
          color: #6f7471;
          cursor: not-allowed;
        }
      `}</style>
      {children}
    </button>
  );
};

export const Footer = () => (
  <footer>
    <style jsx>{`
      footer {
        border-top: solid 1px #d4d6d4;
        padding: 0.9rem;
        width: 100%;
        display: block;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
    <Link href="https://figment.io/" target="_blank">
      Figment.io
    </Link>
    <Image src="/f.svg" alt="Figment Logo" width={64} height={32} />
    <Link href="https://docs.figment.io/" target="_blank">
      Documentation
    </Link>
  </footer>
);

export const BreadCrumbs = ({ step = 0 }) => {
  const steps = [
    "Create Account",
    "Create a Flow",
    "Submit Data",
    "Decode & Sign Payload",
    "Broadcast Transaction",
    "View All Flows",
  ];

  return (
    <header>
      <style jsx>{`
        header {
          overflow: hidden;
          align-items: center;
          white-space: nowrap;
          text-align: left;
          display: flex;
          border-bottom: solid 1px #d4d6d4;
          padding: 0 2rem;
        }
        header div {
          position: relative;
          display: inline-block;
          overflow: hidden;
          text-overflow: clip;
          white-space: nowrap;
          padding: 1.2rem 0;
          color: #6f7471;
          font-size: 1.6rem;
          flex-shrink: 1;
        }
        header div.current {
          font-weight: 600;
          color: #0e5048;
        }
        header span {
          position: relative;
          display: inline-block;
          overflow: hidden;
          text-overflow: clip;
          white-space: nowrap;
          flex-shrink: 1;
          padding: 0 2rem;
        }
      `}</style>
      {steps.map((text, index) => (
        <React.Fragment key={`bc_step_${index}`}>
          {index !== 0 && <span>{index === step + 1 ? "→" : "-"}</span>}
          <div
            style={{
              flexShrink: step === index ? 0 : step + 1 === index ? 1 : 99,
            }}
            className={step === index ? "current" : ""}
          >
            {text}
          </div>
        </React.Fragment>
      ))}
    </header>
  );
};

export const Formatted = ({ children, block = false }) => (
  <code>
    <style jsx>{`
      code {
        white-space: pre-wrap;
        background-color: #f1f4f3;
        line-height: 1;
        padding: ${block ? "2rem" : ".5rem"};
        display: ${block ? "block" : "inline-block"};
      }
    `}</style>
    {children}
  </code>
);

export default function UIComponents() {
  return (
    <>
      <BreadCrumbs step={3} />
      <PageTitle
        title="Visualize Figment's Staking API"
        headline="Learn how to use Figment's Staking API in an intuitive, visual format"
      />
      <Card>
        <h5>Hey</h5>
        <p>test content</p>
        <Button desctructive>Test</Button>
      </Card>

      <Formatted>
        this is a code snippet with a <a href="test">link</a>
      </Formatted>

      <Formatted block>this is a code block</Formatted>
      <Footer />
    </>
  );
}
