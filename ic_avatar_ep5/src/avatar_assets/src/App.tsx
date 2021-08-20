import * as React from "react";
import {
  Provider,
  defaultTheme,
  Flex,
  ActionButton,
} from "@adobe/react-spectrum";
import styled from "styled-components";
import { AuthClient } from "@dfinity/auth-client";
import { avatar, canisterId, createActor } from "../../declarations/avatar";
import NotAuthenticated from "./components/NotAuthenticated";
import Home from "./components/Home";
import Loader from "./components/Loader";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../declarations/avatar/avatar.did";
import { Toaster } from "react-hot-toast";
import { clear } from "local-storage";
import ErrorBoundary from "./components/ErrorBoundary";

const Header = styled.header`
  position: relative;
  padding: 1rem;
  display: flex;
  justify-content: center;
  h1 {
    margin-top: 0;
  }
  #logout {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

export const AppContext = React.createContext<{
  authClient?: AuthClient;
  actor: ActorSubclass<_SERVICE>;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMessage?: React.Dispatch<React.SetStateAction<string>>;
}>({
  authClient: undefined,
  actor: avatar,
});

const App = () => {
  const [authClient, setAuthClient] = React.useState<AuthClient>();
  const [actor, setActor] = React.useState<ActorSubclass<_SERVICE>>(avatar);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("");

  React.useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
      setLoadingMessage("");
    });
  }, [setAuthClient]);

  React.useEffect(() => {
    // Check whether we're authenticated
    authClient?.isAuthenticated().then(async (result) => {
      if (result) {
        // If we are authenticated, create an actor configured with our identity
        const actor = createActor(canisterId as string, {
          agentOptions: {
            identity: authClient.getIdentity(),
          },
        });
        setActor(actor);
        setIsAuthenticated(result);
      } else {
        // Wipe local state;
        clear();
      }
    });
  }, [authClient]);

  if (!authClient) return null;

  return (
    <>
      <Toaster
        toastOptions={{
          duration: 5000,
          position: "bottom-center",
        }}
      />
      <ErrorBoundary>
        <Provider theme={defaultTheme}>
          <AppContext.Provider
            value={{
              authClient,
              setIsAuthenticated,
              actor,
              setLoadingMessage,
            }}
          >
            <Header>
              {isAuthenticated ? (
                <ActionButton
                  id="logout"
                  onPress={() => {
                    clear();
                    setIsAuthenticated(false);
                  }}
                >
                  Log out
                </ActionButton>
              ) : null}
              <h2>IC Avatar</h2>
            </Header>
            <Main>
              <Flex maxWidth={900} margin="1rem auto">
                {!isAuthenticated && !loadingMessage ? (
                  <NotAuthenticated />
                ) : (
                  <Home />
                )}
              </Flex>
            </Main>
            {loadingMessage ? <Loader message={loadingMessage} /> : null}
          </AppContext.Provider>
        </Provider>
      </ErrorBoundary>
    </>
  );
};

export default App;
