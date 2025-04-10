import React, { useContext } from "react";

export type User = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  nickname?: string;
};

type IdentityProviderContextProps = {
  user?: User;
  getAccessToken: () => Promise<string>;
  logout: () => void;
};

type GenericIdentityProviderProps = {
  children: React.ReactNode;
  identity: IdentityProviderContextProps;
};

const identityProviderContext = React.createContext<
  IdentityProviderContextProps | undefined
>(undefined);

export const useIdentity = () => {
  const identity = useContext(identityProviderContext);
  // if (identity === undefined) {
  //   throw Error('Identity must be retrieved in the context of an "IdentityProvider"')
  // }

  return (
    identity || {
      getAccessToken: () => {},
      logout: () => () => {},
    }
  );
};

const GenericIdentityProvider: React.FC<GenericIdentityProviderProps> = ({
  children,
  identity,
}) => {
  return !identity ? null : (
    <identityProviderContext.Provider value={identity}>
      {children}
    </identityProviderContext.Provider>
  );
};

export default GenericIdentityProvider;
