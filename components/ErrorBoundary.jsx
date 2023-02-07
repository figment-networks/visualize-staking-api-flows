import React from "react";
import { Button, Card, Headline } from "@pages/ui-components";

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
        <Card large>
          <div className="container">
            <Headline>Oops, there is an error!</Headline>
            <Button
              secondary
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </Button>
          </div>
        </Card>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
