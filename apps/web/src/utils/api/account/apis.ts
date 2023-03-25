import { clientFetcher, serverFetcher } from '@supercarmarket/lib';
import { type AccountTab } from 'constants/account';

export const getAccount = async ({
  id,
  token,
}: {
  id: string;
  token?: string;
}) => {
  const header = token
    ? {
        ACCESS_TOKEN: token,
      }
    : undefined;

  return clientFetcher('/server/supercar/v1/userpage', {
    headers: header,
    method: 'GET',
    query: {
      id,
    },
  });
};

export const getAccountCategory = async ({
  id,
  query,
  token,
}: {
  id: string;
  query: {
    category: AccountTab;
    page: number;
    size: number;
  };
  token?: string;
}) => {
  const headers = token
    ? {
        ACCESS_TOKEN: token,
      }
    : undefined;

  return clientFetcher(
    `/server/supercar/v1/userpage/category/${query.category}/id`,
    {
      method: 'GET',
      headers,
      params: id,
      query: {
        ...query,
        page: query.page + 1,
      },
    }
  );
};

export const getAccountUpdateInfo = async (token: string) => {
  return clientFetcher(`/server/supercar/v1/user/info`, {
    method: 'GET',
    headers: {
      ACCESS_TOKEN: token,
    },
  });
};

export const prefetchAccount = async ({
  id,
  token,
}: {
  id: string;
  token?: string;
}) => {
  const header = token
    ? {
        ACCESS_TOKEN: token,
      }
    : undefined;
  return serverFetcher(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/supercar/v1/userpage`,
    {
      headers: header,
      method: 'GET',
      query: {
        id,
      },
    }
  );
};
