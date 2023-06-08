import axios from "axios";
import { Config } from "sst/node/config";

const Auth0Config = {
  domain: process.env.AUTH0_DOMAIN || Config.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MGMT_CLIENT_ID || Config.AUTH0_MGMT_CLIENT_ID,
  secret: process.env.AUTH0_MGMT_SECRET || Config.AUTH0_MGMT_SECRET,
};

type Auth0User = {
  email: string;
  email_verified: boolean;
  name: string;
  nickname: string;
  picture: string;
  user_id: string;
  username: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
};

const getManagmentToken = async () => {
  var options = {
    method: "POST",
    url: `https://${Auth0Config.domain}/oauth/token`,
    headers: { "content-type": "application/json" },
    data: {
      client_id: Auth0Config.clientId,
      client_secret: Auth0Config.secret,
      audience: `https://${Auth0Config.domain}/api/v2/`,
      grant_type: "client_credentials",
    },
  };

  const response = axios.request(options);
  return (await response).data.access_token;
};

export const getAuth0User = async (userId: string): Promise<Auth0User> => {
  console.log(`Getting Auth0 User: ${userId}`);
  const token = await getManagmentToken();
  const options = {
    method: "GET",
    url: `https://${Auth0Config.domain}/api/v2/users/${userId}`,
    headers: { authorization: `Bearer ${token}` },
  };
  const response = axios.request(options);
  return (await response).data;
};
