import React from 'react'
import { Evaluator as EvaluatorComponent } from '../Evaluator/EvaluatorComponent'

import Frame from '../../Frame'

const Evaluator: React.FC = () => {
  return (
    <Frame>
      <EvaluatorComponent />
    </Frame>
  )
}

export default Evaluator
