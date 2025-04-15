import React from 'react'

import { PolicyEvaluatorContextProvider } from '../../../../services/PolicyEvaluatorContextProvider'
import Frame from '../../Frame'
import { Evaluator as EvaluatorComponent } from '../Evaluator/EvaluatorComponent'

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
