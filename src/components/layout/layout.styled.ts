import DEVICE_LIST from 'constants/device';
import styled from 'styled-components';
import { applyMediaQuery } from 'styles/mediaQuery';

const availableWidth = {
  desktop: '100%',
  wideDesktop: '1200px',
};

const Container = styled.div`
  margin: 0 auto;
  padding-top: 1.25rem;
  ${DEVICE_LIST.map(
    (device) => `${applyMediaQuery(device)} {
    width: ${availableWidth[device]};
  }`
  ).join('')}
  min-height: calc(100vh - 1.25rem);
`;

const Main = styled.main``;

export { Container, Main };
