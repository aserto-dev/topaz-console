import styled from 'styled-components'

export const Grid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0 85px 1fr;
  gap: 0px 0px;
  grid-template-areas:
    'header'
    'sidebar'
    'content';

  @media (min-width: 1px) {
  }

  @media (min-width: 1328px) {
    display: grid;
    grid-template-columns: 250px 1.3fr 1fr;
    grid-template-rows: 0 1.7fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      'header header header'
      'sidebar content content'
      'sidebar content content';
  }
  .decision-logs-content {
    height: 100%;
    overflow-x: hidden;
  }
`

export const Header = styled.div`
  @media (min-width: 1328px) {
    grid-area: header;
  }
`

export const Sidebar = styled.div`
  @media (min-width: 1328px) {
    grid-area: sidebar;
  }
`

export const Content = styled.div`
  grid-area: content;
  display: flex;
  height: 100%;
  width: 100%;
`

export const Row = styled.div`
  display: flex;
  line-height: 1;
  @media (max-width: 1327px) {
    flex-wrap: wrap;
    padding: 20px;
  }
  @media (min-width: 991px) {
    /* margin-top: 70px; */
  }
`

export const SelectContainer = styled.div`
  width: 100%;
  display: none;
  margin-bottom: 20px;
  @media (max-width: 1327px) {
    display: block;
    width: 100%;
  }
`
export const LeftContainer = styled.div`
  margin-right: 20px;
  min-width: 250px;
  @media (max-width: 1327px) {
    display: none;
  }
`
