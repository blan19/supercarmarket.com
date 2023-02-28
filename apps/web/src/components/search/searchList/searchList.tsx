import { useUrlQuery } from '@supercarmarket/hooks';
import type { CommunityDto } from '@supercarmarket/types/community';
import type { MagazineDto } from '@supercarmarket/types/magazine';
import type { MarketDto } from '@supercarmarket/types/market';
import type { SearchAll as SearchAllType } from '@supercarmarket/types/search';
import { Container } from '@supercarmarket/ui';
import useSearch from 'hooks/queries/useSearch';
import {
  SearchAll,
  SearchCommunity,
  SearchMagazine,
  SearchMarket,
  SearchNavbar,
} from '..';
import SearchNotify from '../searchNotify';

const SearchList = () => {
  const {
    category = 'null',
    keyword = '',
    orderBy,
    filter,
    page,
  } = useUrlQuery();
  const { data } = useSearch({
    keyword: keyword ?? 'null',
    orderBy: orderBy,
    filter: filter,
    category: category,
    page,
  });
  console.log(data);

  return (
    <Container>
      {data && (
        <>
          <SearchNotify keyword={keyword} totalCount={data.totalCount} />
          <SearchNavbar keyword={keyword} category={category} />
          {
            {
              all: (
                <SearchAll
                  keyword={keyword}
                  data={data.data as SearchAllType}
                />
              ),
              paparazzi: <SearchCommunity data={data.data as CommunityDto[]} />,
              product: <SearchMarket data={data.data as MarketDto[]} />,
              magazine: <SearchMagazine data={data.data as MagazineDto[]} />,
            }[category]
          }
        </>
      )}
    </Container>
  );
};

export default SearchList;