import Image from "next/image";
import Link from "next/link";
import React from "react";
import { default as HeadComponent } from "next/head";
import ToolTip from "@components/elements/ToolTip";

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
        margin-top: 8rem;
        margin-bottom: 2.8rem;
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

export const Card = ({
  children,
  small = false,
  medium = false,
  large = false,
  justify = false,
  ...props
}) => (
  <div {...props}>
    <style jsx>{`
      div {
        background-color: #ffffff;
        border: solid 0.1rem #d4d6d4;
        border-radius: 0.8rem;
        flex-shrink: 0;
        padding: 2.4rem;
        width: 100%;
        ${small ? "max-width: 80rem;" : ""}
        ${medium ? "max-width: 120rem;" : ""}
        ${large ? "max-width: none;" : ""}
        overflow: hidden;
        margin-bottom: 2.4rem;
      }

      div :global(button.btn),
      div :global(a.btn) {
        width: max-content;
        display: block;
        margin: 0 auto;
      }

      div > :global(*) {
        display: block;
        margin-bottom: 2rem;
      }

      div > :global(*):last-child {
        margin-bottom: 0;
      }

      div > :global(h5) {
        text-align: center;
      }

      div > :global(*) {
        ${justify ? "text-align: justify;" : ""}
        white-space: pre-wrap;
        word-break: break-word;
      }
    `}</style>
    {children}
  </div>
);

export const Button = ({
  children,
  destructive = false,
  secondary = false,
  href = null,
  small = false,
  style = {},
  ...props
}) => {
  return (
    <>
      <style jsx>{`
        button.btn,
        a.btn {
          color: #ffffff;
          border: solid 0.2rem;
          background-color: #0e5048;
          border-color: #0e5048;
          ${destructive ? "border-color: #C01005;" : ""}
          ${destructive ? "background-color: #C01005;" : ""}
          ${secondary ? "border-color: #111111;" : ""}
          ${secondary ? "background-color: #111111;" : ""}
          border-radius: 3.6rem;
          padding: 1rem 2.8rem;
          ${small ? "padding: .6rem 2.4rem;" : ""}
          font-weight: 600;
          font-size: 1.6rem;
          ${small ? "font-size: 1.2rem" : ""}
          transition: color 250ms, background-color 250ms;
          cursor: pointer;
          text-decoration: none;
        }

        a.btn {
          display: inline-block;
        }

        button.btn:hover:not(:active):not(:disabled),
        a.btn:hover:not(:active):not(:disabled) {
          color: #0e5048;
          background-color: #ffffff;
          ${destructive ? "color: #C01005;" : ""}
          ${secondary ? "color: #111111;" : ""}
        }

        button.btn:disabled,
        a.btn:disabled {
          border-color: #efefef;
          background-color: #efefef;
          color: #6f7471;
          cursor: not-allowed;
        }
      `}</style>
      {href ? (
        <Link href={href} {...props} legacyBehavior>
          <button className="btn" style={style}>
            {children}
          </button>
        </Link>
      ) : (
        <button className="btn" style={style} {...props}>
          {children}
        </button>
      )}
    </>
  );
};

export const Footer = () => (
  <footer>
    <style jsx>{`
      footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        border-top: solid 1px #d4d6d4;
        padding: 0.8rem;
        display: flex;
        background-color: #f9f9f9;
        z-index: 10;
        justify-content: center;
        align-items: center;
      }
      footer > :global(*) {
        margin: 0;
      }
    `}</style>
    <Link
      href="https://www.figment.io/"
      rel="noopener noreferrer"
      target="_blank"
    >
      Figment.io
    </Link>
    <ToolTip
      placement="top"
      title={`Click on the Figment logo at any time to return to the main page of this app`}
    >
      <Link href="/">
        <Image src="/f.svg" alt="Figment Logo" width={64} height={32} />
      </Link>
    </ToolTip>
    <Link
      href="https://docs.figment.io/"
      rel="noopener noreferrer"
      target="_blank"
    >
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
    "Get Flow State",
    "View All Flows",
  ];

  return (
    <header>
      <style jsx>{`
        header {
          position: fixed;
          top: 0;
          width: 100%;
          overflow: hidden;
          align-items: center;
          white-space: nowrap;
          text-align: left;
          background-color: #f9f9f9;
          z-index: 10;
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
          line-height: calc(1em + 0.7rem);
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

export const Formatted = ({ children, block = false, maxHeight = "none" }) => (
  <code>
    <style jsx>{`
      code {
        border-radius: 5px;
        white-space: pre-wrap;
        background-color: rgba(0, 0, 0, 0.2);
        line-height: calc(1em + 0.8rem);
        padding: ${block ? "2rem" : "0 .4rem"};
        display: ${block ? "block" : "inline"};
        word-break: break-all;
        max-height: ${maxHeight};
        overflow-y: auto;
        vertical-align: baseline;
      }

      /* Width for vertical scrollbars */
      code::-webkit-scrollbar {
        width: 10px;
      }

      /* Hide horizontal scrollbars */
      code::-webkit-scrollbar:horizontal {
        display: none;
      }

      /* Scrollbar foreground */
      code::-webkit-scrollbar-thumb {
        background: #b1b1b1;
        border-radius: inherit;
        /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
      }

      /* Scrollbar background */
      code::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: inherit;
        /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
      }

      code::-webkit-scrollbar-corner {
        background: rgba(0, 0, 0, 0.1);
        border-radius: inherit;
      }
    `}</style>
    {children}
  </code>
);

export const LayoutCenter = ({ children }) => (
  <div>
    <style jsx>{`
      div {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        padding: calc(4.8rem + 2.4rem) 2.4rem;
        padding-bottom: calc(4.9rem + 2.4rem);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: ;
      }
      div > :global(h3) {
        margin-top: 2.8rem;
      }
    `}</style>
    {children}
  </div>
);

export const VerticalLayout = ({ children }) => (
  <div>
    <style jsx>{`
      div {
        position: relative;
        width: 100%;
        display: flex;
        padding: calc(4.8rem + 2.4rem) 2.4rem;
        padding-bottom: calc(4.9rem + 2.4rem);
        flex-direction: column;
        align-items: center;
      }
      div > :global(h3) {
        margin-top: 2.8rem;
      }
    `}</style>
    {children}
  </div>
);

export const ColumnLayout = ({ children, title }) => (
  <div className="container">
    <style jsx>{`
      div.container {
        position: relative;
        padding: calc(4.8rem + 2.4rem) 2.4rem;

        width: 100%;
        height: 100%;
      }
      div > :global(h3) {
        margin-top: 2.8rem;
      }

      div.container > div {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        padding-bottom: calc(4.9rem + 2.4rem);
      }

      div.container > div > :global(div.column) {
        padding: 0 2.4rem;
      }
    `}</style>
    {title}
    <div>{children}</div>
  </div>
);

// eslint-disable-next-line react/display-name
ColumnLayout.Column = ({ children, ...props }) => (
  <div className="column" {...props}>
    {children}
  </div>
);

export default function UIComponents() {
  return (
    <>
      <BreadCrumbs step={4} />
      <Title>Visualize Figment&apos;s Staking API</Title>
      <Headline>
        Learn how to use Figment&apos;s Staking API in an intuitive, visual
        format
      </Headline>
      <Card>
        <h5>Hey</h5>
        <p>test content</p>
        <Button destructive>Test</Button>
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
