import React from 'react'
import { Evaluator as EvaluatorComponent } from '../Evaluator/EvaluatorComponent'

import Frame from '../../Frame'
import { PolicyEvaluatorContextProvider } from '../../../../services/PolicyEvaluatorContextProvider'

const Evaluator: React.FC = () => {
  return (
    <Frame>
      <PolicyEvaluatorContextProvider>
        <EvaluatorComponent />
      </PolicyEvaluatorContextProvider>
    </Frame>
  )
}

export default Evaluator
