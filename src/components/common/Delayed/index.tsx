import React, { useEffect, useState } from 'react'

interface DelayedProps {
  children: React.ReactNode
  waitBeforeShow: number
}

const Delayed: React.FC<DelayedProps> = ({ children, waitBeforeShow }) => {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setHidden(false), waitBeforeShow)
    return () => clearTimeout(timer)
  }, [waitBeforeShow])

  return hidden ? null : <>{children}</>
}

export default Delayed
