import React from "react";

import { MessageText } from "./Styles";
import { ApiError } from "../../lib/error/ApiError";

interface OverviewProps {
  error: Error;
}

const Overview: React.FC<OverviewProps> = ({ error }) => {
  if (error instanceof ApiError) {
    const { code, message, type, reason } = error;
    return (
      <>
        <strong>Code</strong>
        <MessageText>{code}</MessageText>
        <strong>Message</strong>
        <MessageText>{message}</MessageText>
        {type && (
          <>
            <strong>Type</strong>
            <MessageText>{type}</MessageText>
          </>
        )}
        {reason && (
          <>
            <strong>Reason</strong>
            <MessageText>{reason}</MessageText>
          </>
        )}
      </>
    );
  } else {
    return (
      <>
        <strong>Message</strong>
        <MessageText>{error.message}</MessageText>
      </>
    );
  }
};

export default Overview;
