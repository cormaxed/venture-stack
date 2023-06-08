import { initAuth0 } from "@auth0/nextjs-auth0";
import { AppConfig } from "./config";

export default AppConfig.auth0ClientId
  ? initAuth0({
      secret: AppConfig.auth0Secret,
      issuerBaseURL: AppConfig.auth0IssuerBaseUrl,
      baseURL: AppConfig.auth0BaseUrl,
      clientID: AppConfig.auth0ClientId,
      clientSecret: AppConfig.auth0ClientSecret,
    })
  : null;
