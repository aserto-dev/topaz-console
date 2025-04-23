import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { FormatOptionLabelMeta } from 'react-select'

import { useDirectoryV3ObjectTypesList } from '../../../../api/directory/customQuery'
import {
  VerticalTabOptions,
  VerticalTabs,
} from '../../../../components/common/NestedVerticalTabs'
import { Row } from '../../../../components/common/Row'
import SelectDirectory, {
  SelectOption,
} from '../../../../components/common/SelectDirectory'
import { LeftContainer, SelectContainerDirectory } from './styles'

export const DirectorySidebar: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useDirectoryV3ObjectTypesList()
  const objectTypes = useMemo(() => {
    return data?.results || []
  }, [data?.results])

  const verticalTabOptions: VerticalTabOptions[] = useMemo(() => {
    const options: VerticalTabOptions[] = [
      {
        section: {
          label: 'Model',
          redirects: true,
          value: '/ui/directory/model',
        },
      },
      {
        section: {
          label: 'Relations',
          redirects: true,
          value: '/ui/directory/relations',
        },
      },
    ]

    if (objectTypes.length > 0) {
      options.push({
        section: {
          label: 'Objects',
          redirects: true,
          value: '/ui/directory/objects',
        },
        subOptions: objectTypes.map((o) => ({
          label: o.displayName || o.name,
          redirects: true as const,
          value: `/ui/directory/objects/${encodeURIComponent(o.name)}`,
        })),
      })
    }

    options.push(
      {
        section: {
          label: 'Evaluator',
          redirects: true,
          value: '/ui/directory/evaluator',
        },
      },
      {
        section: {
          label: 'API Browser',
          redirects: true,
          value: '/ui/directory/docs',
        },
      },
      {
        section: {
          label: 'Danger Zone',
          redirects: true,
          value: '/ui/directory/danger',
        },
      },
    )

    return options
  }, [objectTypes])

  const selectOptions = verticalTabOptions.map((o) => {
    return {
      label: o.section.label,
      options: o.subOptions
        ? o.subOptions
            .filter((so: { redirects: unknown }) => so.redirects)
            .map((so: { label: string; value: string }) => {
              return {
                group: o.section.label,
                label: so.label,
                value: so.value,
              }
            })
        : [
            {
              group: o.section.label,
              label: '',
              value: o.section.value,
            },
          ],
    }
  })

  const { pathname } = useLocation()

  const selectedOption = pathname

  const onChangeVerticalTab = (path: string) => {
    navigate(path)
  }

  const formatOptionLabel = (
    option: SelectOption,
    meta: FormatOptionLabelMeta<SelectOption>,
  ) =>
    meta.context === 'value'
      ? option.label !== ''
        ? `${
            option.group.endsWith('s')
              ? option.group.slice(0, -1)
              : option.group
          }: ${option.label}`
        : option.group
      : option.label

  return (
    <Row>
      <LeftContainer>
        <VerticalTabs options={verticalTabOptions} />
      </LeftContainer>
      <SelectContainerDirectory>
        <SelectDirectory
          aria-label="Sections"
          formatGroupLabel={(a: { label?: string }) => {
            return a?.label ? (
              <div
                style={{
                  alignItems: 'center',
                  borderTop: '1px #414141 solid',
                  display: 'flex',
                  minHeight: '36px',
                }}
              >
                {a.label}
              </div>
            ) : undefined
          }}
          formatOptionLabel={formatOptionLabel}
          options={selectOptions}
          value={(
            selectOptions.find((option) =>
              option.options.find(
                (option: { value: string }) => option.value === selectedOption,
              ),
            ) || selectOptions[0]
          ).options.find(
            (option: { value: string }) => option.value === selectedOption,
          )}
          onChange={(newValue) => {
            if (newValue && 'value' in newValue) {
              onChangeVerticalTab(String(newValue.value))
            }
          }}
        />
      </SelectContainerDirectory>
    </Row>
  )
}
