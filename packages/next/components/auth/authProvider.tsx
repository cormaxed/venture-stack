import { UserProvider } from "@auth0/nextjs-auth0/client";
import { BrowserConfig } from "../../lib/browser-config";

export const AuthProvider = ({ children }) => {
  if (BrowserConfig.auth0Enabled) {
    return <UserProvider>{children}</UserProvider>;
  }
  return children;
};
