import styled from 'styled-components'

export const ContentContainer = styled.div`
  padding: 20px;
  width: 100%;
  height: fit-content;
`
export const TextArea = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #ff4a4a;
`
export const Text = styled.div<{ bold?: boolean }>`
  display: flex;
  font-weight: ${({ bold }) => (bold ? 'bold' : 500)};
`

export const InputContainer = styled.div`
  input {
    width: 600px;
  }
`

export const ButtonsContainer = styled.div`
  width: 100%;
  flex: 1 1 0%;
  justify-content: flex-end;
  align-items: flex-end;
  float: right;
  display: flex;
  margin-top: 20px;
  button:first-of-type {
    margin-right: 10px;
  }
`
