import React, { useEffect, useState } from 'react'

interface DelayedProps {
  waitBeforeShow: number
  children: React.ReactNode
}

const Delayed: React.FC<DelayedProps> = ({ waitBeforeShow, children }) => {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setHidden(false), waitBeforeShow)
    return () => clearTimeout(timer)
  }, [waitBeforeShow])

  return hidden ? null : <>{children}</>
}

export default Delayed
