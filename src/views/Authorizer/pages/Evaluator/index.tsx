import React from 'react'

import { PolicyEvaluatorContextProvider } from '../../../../services/PolicyEvaluatorContextProvider'
import { Evaluator as EvaluatorComponent } from '../Evaluator/EvaluatorComponent'

const Evaluator: React.FC = () => {
  return (
    <PolicyEvaluatorContextProvider>
      <EvaluatorComponent />
    </PolicyEvaluatorContextProvider>
  )
}

export default Evaluator
