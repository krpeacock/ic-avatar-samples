import { Button, Flex, Icon } from "@adobe/react-spectrum";
import * as React from "react";
import styled from "styled-components";
import Loop from "../../assets/loop.svg";
import { AuthContext } from "../App";

interface Props {}

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

function NotAuthenticated(props: Props) {
  const {} = props;
  const { authClient, setIsAuthenticated } = React.useContext(AuthContext);

  return (
    <Section>
      <h3>You are not authenticated</h3>
      <Button
        variant="cta"
        onPress={async () => {
          await authClient?.login({
            identityProvider: process.env.II_URL,
          });
          setIsAuthenticated?.(true);
        }}
      >
        Login with&nbsp;
        <Icon>
          <Loop />
        </Icon>
      </Button>
    </Section>
  );
}

export default React.memo(NotAuthenticated);
