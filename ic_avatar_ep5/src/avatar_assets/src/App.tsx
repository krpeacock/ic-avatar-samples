import * as React from "react";
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import styled from "styled-components";
import { AuthClient } from "@dfinity/auth-client";
import { avatar } from "../../declarations/avatar";
import NotAuthenticated from "./components/NotAuthenticated";
import Home from "./components/Home";

const Header = styled.header`
  padding: 1rem;
  display: flex;
  justify-content: center;
  h1 {
    margin-top: 0;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

export const AuthContext = React.createContext<{
  authClient?: AuthClient;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  authClient: undefined,
});

const App = () => {
  const [authClient, setAuthClient] = React.useState<AuthClient>();
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
      setLoading(false);
    });
  }, [setAuthClient]);

  React.useEffect(() => {
    authClient?.isAuthenticated().then((result) => setIsAuthenticated(result));
  }, [authClient]);

  console.log(isAuthenticated);

  return (
    <Provider theme={defaultTheme}>
      <AuthContext.Provider value={{ authClient, setIsAuthenticated }}>
        <Header>
          <h1>IC Avatar</h1>
        </Header>
        <Main>
          {!isAuthenticated && !loading ? <NotAuthenticated /> : <Home />}
        </Main>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
