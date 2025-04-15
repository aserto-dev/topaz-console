import React from 'react'

export type DisplayState = Readonly<{
  enabled: boolean
  visible: boolean
}>

type EvaluateDisplayStateProps = {
  children: React.ReactElement<{ disabled?: boolean }>
  displayState: DisplayState
}

const EvaluateDisplayStateComponent: React.FC<EvaluateDisplayStateProps> = ({
  children,
  displayState,
}) => {
  const isVisible = displayState.visible
  const isEnabled = displayState.enabled

  return (
    <>{isVisible && React.cloneElement(children, { disabled: !isEnabled })}</>
  )
}

const EvaluateDisplayState = React.memo(EvaluateDisplayStateComponent)

export default EvaluateDisplayState
