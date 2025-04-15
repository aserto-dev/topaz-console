import React, { PropsWithChildren } from 'react'
import { To, useMatch, useResolvedPath } from 'react-router'

import blank from './assets/selected_blank.svg'
import circle from './assets/selected_circle.svg'
import {
  AddTypeButton,
  TabContainer,
  TabSectionOptions,
  VerticalTab,
} from './styles'

export interface VerticalTabOptions {
  section: NestedTabOptions
  subOptions?: (NestedTabButton | NestedTabOptions)[]
}

interface NestedTabButton {
  label: string
  onClick: () => void
  redirects: false
  value: string
}

interface NestedTabOptions {
  isDisabled?: boolean
  label: string
  redirects: true
  value: string
}

type TabOption =
  | {
      label: string
      onClick: () => void
      redirects: false
    }
  | {
      label: string
      onClick?: () => void
      redirects: true
      value: string
    }

type VerticalTabParams = {
  depth: number
  subLinks?: TabOption[]
  to: To
}

type VerticalTabsProps = {
  options: VerticalTabOptions[]
  selectedValue?: string
}

const NestedVerticalTab: React.FC<PropsWithChildren<VerticalTabParams>> = ({
  children,
  depth,
  subLinks,
  to,
}) => {
  const resolved = useResolvedPath(to)
  const active = useMatch({ end: false, path: `${resolved.pathname}/*` })

  let icon: string

  switch (depth) {
    case 0:
      icon = blank
      break
    default:
      icon = circle
      break
  }

  return (
    <>
      <VerticalTab $depth={depth} to={to}>
        <img alt="show" src={icon} />
        {children}
      </VerticalTab>

      <TabSectionOptions $show={active !== null}>
        {subLinks?.map((s) =>
          s.redirects ? (
            <NestedVerticalTab key={s.value} depth={depth + 1} to={s.value}>
              {s.label}
            </NestedVerticalTab>
          ) : (
            <AddTypeButton key={s.label} onClick={s.onClick}>
              <span>{s.label}</span>
            </AddTypeButton>
          ),
        )}
      </TabSectionOptions>
    </>
  )
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({ options }) => {
  return (
    <TabContainer>
      {options.map((option) => {
        return (
          <div key={option.section.value}>
            <NestedVerticalTab
              depth={0}
              subLinks={option.subOptions}
              to={option.section.value}
            >
              {option.section.label}
            </NestedVerticalTab>
          </div>
        )
      })}
    </TabContainer>
  )
}
