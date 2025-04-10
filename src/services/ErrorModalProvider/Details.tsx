import React from 'react'

import { MessageText } from './Styles'

interface DetailsProps {
  items: Record<string, unknown>
}

const Details: React.FC<DetailsProps> = ({ items }) => {
  return (
    <>
      {Object.keys(items).map((key) => (
        <React.Fragment key={key}>
          <strong>{key}</strong>
          <MessageText>{String(items[key])}</MessageText>
        </React.Fragment>
      ))}
    </>
  )
}

export default Details
