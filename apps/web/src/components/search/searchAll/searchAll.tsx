import type { SearchAll as SearchAllType } from '@supercarmarket/types/search';
import { Container, Table, Title, Wrapper } from '@supercarmarket/ui';
import { CommunityCard } from 'components/community';
import RouterButton from 'components/home/routerButton';
import MagazineCard from 'components/magazine/magazineList/magazineCard';
import MarketCard from 'components/market/marketCard';
import { css } from 'styled-components';
import { SearchNotify } from '..';

interface SearchAllProps {
  data: SearchAllType;
  keyword: string;
}

const SearchAll = ({ keyword, data }: SearchAllProps) => {
  const { product, magazine, paparazzi } = data;
  const isProduct = product.length > 0;
  const isMagazine = magazine.length > 0;
  const isPaparazzi = paparazzi.length > 0;
  return (
    <Container
      width="100%"
      display="flex"
      flexDirection="column"
      padding="40px 0 0 0"
    >
      <Title marginBottom="20px">매장</Title>
      <Table tab="product" hidden={false} />
      <Wrapper
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          padding-top: 6px;
        `}
      >
        {isProduct ? (
          product.map((p) => <MarketCard variant="row" key={p.id} {...p} />)
        ) : (
          <SearchNotify keyword={keyword} totalCount={product.length} />
        )}
        {isProduct && (
          <RouterButton
            href={`/search?category=product&keyword=${keyword}`}
            style={{
              paddingTop: '34px',
            }}
          >
            더보기
          </RouterButton>
        )}
      </Wrapper>
      <Title marginTop="80px">슈마매거진</Title>
      <Wrapper
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 20px;
          align-items: center;
        `}
      >
        {isMagazine ? (
          <Wrapper.Item
            css={css`
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 20px;
            `}
          >
            {magazine.map((m) => (
              <MagazineCard type="small" key={m.id} {...m} />
            ))}
          </Wrapper.Item>
        ) : (
          <SearchNotify keyword={keyword} totalCount={magazine.length} />
        )}
        {isMagazine && (
          <RouterButton
            href={`/search?category=magazine&keyword=${keyword}`}
            style={{
              paddingTop: '34px',
            }}
          >
            더보기
          </RouterButton>
        )}
      </Wrapper>
      <Title marginTop="80px" marginBottom="20px">
        커뮤니티
      </Title>
      <Table tab="community" hidden={false} />
      <Wrapper
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          padding-top: 6px;
        `}
      >
        {isPaparazzi ? (
          paparazzi.map((p) => (
            <CommunityCard key={p.id} variant="row" {...p} />
          ))
        ) : (
          <SearchNotify keyword={keyword} totalCount={paparazzi.length} />
        )}
        {isPaparazzi && (
          <RouterButton
            href={`/search?category=paparazzi&keyword=${keyword}`}
            style={{
              paddingTop: '34px',
            }}
          >
            더보기
          </RouterButton>
        )}
      </Wrapper>
    </Container>
  );
};

export default SearchAll;