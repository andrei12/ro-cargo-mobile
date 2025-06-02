import { CreateClientConfig } from '~/src/client/client.gen';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  // @TODO:  replace with token from auth provider
  auth: () => '<my_token>',
});
