import { Container, Divider, Table, Wrapper } from '@supercarmarket/ui';
import useMarketDetail from 'hooks/queries/useMarketDetail';
import * as React from 'react';
import { css } from 'styled-components';

import MarketCard from '../marketCard';
import { MarketDetail } from '../marketDetail';
import { ModalProvider } from 'feature/modalContext';
import { MarketDetailSkeleton } from 'components/fallback/loading';
import HeadSeo from 'components/common/headSeo';

interface MarketContentsProps {
  id: string;
}

const MarketContents = (props: MarketContentsProps) => {
  const { id } = props;
  const { data, isFetching, isLoading } = useMarketDetail(id);

  if (isFetching || isLoading) return <MarketDetailSkeleton />;
  // return <MarketDetailSkeleton />;
  return (
    <ModalProvider>
      {data && (
        <>
          <HeadSeo
            title={data.data.carName}
            description={data.data.introduction}
            image={data.data.imgSrc[0] || undefined}
          />
          <Container>
            <>
              <MarketDetail data={data.data} id={id} />
              <Wrapper
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 13px;
                  margin-bottom: 20px;
                `}
              >
                <Table tab="product" hidden={false} />
                {data.carList.map((m) => (
                  <React.Fragment key={m.id}>
                    <MarketCard variant="row" {...m} />
                    <Divider
                      width="100%"
                      height="1px"
                      color="#EAEAEC"
                      margin="0"
                    />
                  </React.Fragment>
                ))}
              </Wrapper>
            </>
          </Container>
        </>
      )}
    </ModalProvider>
  );
};

export default MarketContents;
