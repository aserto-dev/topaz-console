import React, { useState } from "react";

import sadAxolotl from "../../assets/axolotl.svg";
import Button from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ApiError } from "../../lib/error/ApiError";
import { InformationalError } from "../../lib/error/InformationalError";
import Details from "./Details";
import Overview from "./Overview";
import {
  BodyContainer,
  ButtonContainer,
  CardContent,
  CardModalContainer,
  MessageContainer,
  SadAxoLotl,
  Tab,
  TabContainer,
} from "./Styles";

interface ErrorModalProps {
  error: Error | null;
  onClose: () => void;
  onLogout?: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  error,
  onClose,
  onLogout,
}) => {
  const [tab, setTab] = useState<"details" | "overview">("overview");
  const displaySignoutButton =
    (error as ApiError)?.message.startsWith("E10032") && onLogout;

  return (
    <CardModalContainer
      centered
      data-testid="error-modal"
      show={error !== null}
      onHide={onClose}
    >
      <Card
        body={
          <CardContent>
            <BodyContainer>
              <SadAxoLotl>
                <img src={sadAxolotl} />
                <TabContainer>
                  <Tab
                    checked={tab === "overview"}
                    onClick={() => setTab("overview")}
                  >
                    Overview
                  </Tab>
                  {error instanceof ApiError && error.metadata !== null && (
                    <Tab
                      checked={tab === "details"}
                      onClick={() => setTab("details")}
                    >
                      Details
                    </Tab>
                  )}
                </TabContainer>
              </SadAxoLotl>
              <MessageContainer>
                {error === null ? null : tab === "overview" ? (
                  <Overview error={error} />
                ) : (
                  // Details tab is only viewable if the error is an ApiError and metadata exists
                  <Details items={(error as ApiError).metadata!} />
                )}
              </MessageContainer>
            </BodyContainer>
            <ButtonContainer>
              <Button
                variant={displaySignoutButton ? "primary" : "secondary"}
                onClick={onClose}
              >
                Close
              </Button>
              {displaySignoutButton && (
                <Button variant="secondary" onClick={onLogout}>
                  Sign out
                </Button>
              )}
            </ButtonContainer>
          </CardContent>
        }
        height={600}
        title={(error as InformationalError)?.title ?? "Something went wrong"}
        variant="danger"
        width={700}
      />
    </CardModalContainer>
  );
};

export default ErrorModal;
