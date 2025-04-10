import styled from 'styled-components'

import Button from '../../../common/Button'

export const Header = styled.div`
  @media (min-width: 912px) {
    grid-area: header;
  }
`

export const LeftContainer = styled.div`
  min-width: 250px;
  @media (max-width: 912px) {
    display: none;
  }
`
export const SelectContainerDirectory = styled.div`
  width: 97%;
  margin-top: 20px;
  margin-bottom: 10px;
  button {
    margin-top: 25px;
  }
  @media (min-width: 913px) {
    display: none;
  }
`

export const EditImage = styled.img`
  height: 12px;
  width: 12px;
  filter: brightness(150%);
`

export const EditButton = styled(Button)`
  line-height: 18px;
`
