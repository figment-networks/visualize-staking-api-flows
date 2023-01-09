import React from "react";
import { Button } from "antd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <h2>Oops, there is an error!</h2>
          <Button
            type="primary"
            htmlType="button"
            className="errorButton"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </Button>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
