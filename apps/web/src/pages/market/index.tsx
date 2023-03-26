import {
  applyMediaQuery,
  Category,
  Container,
  Searchbar,
  Wrapper,
} from '@supercarmarket/ui';
import type { NextPageWithLayout, Params } from '@supercarmarket/types/base';
import {
  dehydrate,
  QueryClient,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { ErrorFallback } from 'components/fallback';
import layout from 'components/layout';
import MarketBanner from 'components/market/marketBanner';
import MarketCar from 'components/market/marketCar';
import MarketFilter from 'components/market/marketFilter';
import { CATEGORY, CATEGORY_VALUES, MARKET_LINKS } from 'constants/market';
import queries from 'constants/queries';
import type { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchKeyword } from 'hooks/useSearchKeyword';
import { css } from 'styled-components';
import HeadSeo from 'components/common/headSeo';
import Advertisement from 'components/common/advertisement';
import { prefetchMarket, QUERY_KEYS } from 'utils/api/market';

const MarketFilterPage: NextPageWithLayout = ({
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { keydownHandler, keywordRef } = useSearchKeyword({
    domain: 'market',
  });

  return (
    <>
      <HeadSeo
        title="매물"
        description={`${
          CATEGORY.find((value) => value.value === category)?.option ?? ''
        }에 대한 매물`}
      />
      <Advertisement />
      <Container display="flex" flexDirection="column" margin="20px 0 0 0">
        <Wrapper
          css={css`
            ${applyMediaQuery('mobile')} {
              padding: 0 16px;
            }
          `}
        >
          <MarketBanner />
        </Wrapper>
        <Wrapper
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 80px 0;
            ${applyMediaQuery('mobile')} {
              margin: 32px 0;
              padding: 0 16px;
            }
          `}
        >
          <Wrapper.Item
            css={css`
              width: 880px;
              ${applyMediaQuery('mobile')} {
                width: 100%;
              }
            `}
          >
            <Searchbar
              variant="Line"
              placeholder="원하는 차량을 검색하세요"
              onKeyDown={keydownHandler}
              ref={keywordRef}
            />
          </Wrapper.Item>
        </Wrapper>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <Wrapper
              css={css`
                ${applyMediaQuery('mobile')} {
                  padding: 0 16px;
                }
              `}
            >
              <ErrorBoundary
                onReset={reset}
                fallbackRender={(props) => <ErrorFallback {...props} />}
              >
                <Category links={MARKET_LINKS} category={category} />
                <MarketFilter />
                <MarketCar />
              </ErrorBoundary>
            </Wrapper>
          )}
        </QueryErrorResetBoundary>
      </Container>
    </>
  );
};

MarketFilterPage.Layout = layout;

const queryClient = new QueryClient();

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { category } = ctx.query as Params;

  if (!category || !CATEGORY_VALUES.includes(category))
    return {
      redirect: {
        destination: '/market?category=all',
        permanent: false,
      },
    };

  await queryClient.prefetchQuery({
    queryKey: [...QUERY_KEYS.market(), {}],
    queryFn: () => prefetchMarket({}),
  });

  return {
    props: {
      category,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default MarketFilterPage;
