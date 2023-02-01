import Image from "next/image";
import Link from "next/link";
import React from "react";
import { default as HeadComponent } from "next/head";

export const Head = ({ title, description }) => (
  <HeadComponent>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.ico" />
  </HeadComponent>
);

export const Title = ({ children }) => (
  <h3>
    <style jsx>{`
      h3 {
        margin-top: 4rem;
        text-align: center;
      }
      h3 :global(*) {
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
      }
    `}</style>
    {children}
  </h3>
);

export const Headline = ({ children }) => (
  <div>
    <style jsx>{`
      h5 {
        margin-bottom: 2rem;
        text-align: center;
      }
      h5 :global(*) {
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
      }
    `}</style>
    <h5>{children}</h5>
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

export const Button = ({
  children,
  destructive = false,
  href = null,
  ...props
}) => {
  const styles = `
    button.btn, a.btn {
      color: #ffffff;
      border: solid 0.2rem;
      background-color: #0e5048;
      border-color: #0e5048;
      ${destructive ? "border-color: #C01005;" : ""}
      ${destructive ? "background-color: #C01005;" : ""}
      border-radius: 3.6rem;
      padding: 0.9rem 2.8rem;
      font-weight: 600;
      transition: color 250ms, background-color 250ms;
      cursor: pointer;
      display: inline-block;
      text-decoration: none;
    }

    button.btn:hover:not(:active):not(:disabled),
    a.btn:hover:not(:active):not(:disabled) {
      color: #0e5048;
      background-color: #ffffff;
      ${destructive ? "color: #C01005;" : ""}
    }

    button.btn:disabled,
    a.btn:disabled {
      border-color: #efefef;
      background-color: #efefef;
      color: #6f7471;
      cursor: not-allowed;
    }
  `;

  const Comp = href
    ? (props) => (
        <a className="btn" href={href} {...props}>
          <style jsx>{styles}</style>
          {children}
        </a>
      )
    : (props) => (
        <button className="btn" {...props}>
          <style jsx>{styles}</style>
          {children}
        </button>
      );

  return <Comp {...props}>{children}</Comp>;
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
        line-height: ${block ? "calc(1em + 0.8rem);" : "1;"};
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
      <BreadCrumbs step={4} />
      <Title>Visualize Figment's Staking API</Title>
      <Headline>
        Learn how to use Figment's Staking API in an intuitive, visual format
      </Headline>
      <Card>
        <h5>Hey</h5>
        <p>test content</p>
        <Button desctructive>Test</Button>
      </Card>

      <Formatted>
        this is a code snippet with a <a href="test">link</a>
      </Formatted>

      <Formatted block>
        {`this is a code block
with multi-line support`}
      </Formatted>

      <form>
        <h5>title</h5>
        <label>email</label>
        <input type="text" />
        <label>number</label>
        <input type="number" />
      </form>
      <Footer />
    </>
  );
}
