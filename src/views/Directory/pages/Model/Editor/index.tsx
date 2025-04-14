import * as monaco from 'monaco-editor'
import { editor } from 'monaco-editor'
import { configureMonacoYaml, SchemasSettings } from 'monaco-yaml'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import YAML from 'yaml'
import { Monaco } from '@monaco-editor/react'
import { useQueryClient } from '@tanstack/react-query'

import { useManifestData } from '../../../../../api/directory/parsers/manifest'
import { useDirectoryV3ManifestSet } from '../../../../../api/v3/directory'
import save from '../../../../../assets/save.svg'
import { useDirectoryModelContext } from '../../../../../services/DirectoryContextProvider/hooks'
import { useShowError } from '../../../../../services/ErrorModalProvider'
import Button from '../../../../../components/common/Button'
import MonacoEditor from '../../../../../components/common/MonacoEditor'
import {
  ButtonsContainer,
  ControlsContainer,
  Image,
  PropertiesContainer,
  SaveButton,
  StyledEditor,
} from './styles'

const ModelEditor: React.FC = () => {
  const defaultSchema: SchemasSettings = useMemo(() => {
    return {
      uri: 'https://www.topaz.sh/schema/manifest.json',
      fileMatch: ['file://**/manifest.yaml'],
    }
  }, [])

  const { code, setCode, setVisible } = useDirectoryModelContext()

  const queryClient = useQueryClient()
  const [modified, setModified] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errors, setErrors] = useState<string[]>()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const {
    data: manifestData,
    queryKey: manifestQueryKey,
    isRefetching,
  } = useManifestData()
  const manifest = useMemo(() => {
    return manifestData?.toString() || ''
  }, [manifestData])

  const setManifest = useDirectoryV3ManifestSet()
  const showError = useShowError()
  const resetCode = useCallback(() => {
    if (manifest) {
      setCode(manifest)
      editorRef?.current?.setValue(manifest)
    }

    setHasError(false)
    setErrors([])
    setModified(false)
  }, [manifest, setCode])

  const saveCode = useCallback(() => {
    let parsed: YAML.Document.Parsed

    if (code) {
      try {
        parsed = YAML.parseDocument(code)
        editorRef?.current?.setValue(parsed.toString())
        setManifest.mutate(
          {
            data: new Blob([parsed.toString()], { type: 'application/yaml' }),
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: manifestQueryKey })
              setModified(false)
            },
            onError: (error) => {
              showError(error)
              setHasError(true)
            },
          },
        )
        setErrors(undefined)
      } catch (e) {
        setErrors(errors?.concat([String(e)]))
      }
    }
  }, [
    code,
    setErrors,
    errors,
    manifestQueryKey,
    queryClient,
    setManifest,
    showError,
  ])

  const handleOnChange = useCallback(
    (value: string | undefined) => {
      setModified(true)
      if (value) {
        try {
          YAML.parse(value)
          setCode(value || '')
        } catch {
          /* empty */
        }
      }
    },
    [setCode],
  )

  const handleEditorWillMount = (monaco: Monaco) => {
    configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      schemas: [defaultSchema],
    })
  }

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      monaco.editor.setTheme('topaz')
      editorRef.current = editor
      editorRef.current?.onDidChangeModelContent(() => {
        handleOnChange(editorRef.current?.getValue())
      })

      editorRef.current?.onDidChangeModelDecorations(() => {
        const markers = monaco.editor
          .getModelMarkers({ owner: 'yaml' })
          .filter((m) => m.severity > 4)
        setHasError(markers.length !== 0)
      })

      editorRef.current?.updateOptions({
        tabSize: 2,
        fontSize: 14,
        fontLigatures: true,
        scrollbar: {
          verticalScrollbarSize: 4,
          horizontalScrollbarSize: 4,
        },
        inlineSuggest: {
          enabled: true,
        },

        fontFamily:
          "'Fira Code', -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell','Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        minimap: {
          enabled: false,
        },
      })

      setCode(manifest)
      editorRef.current?.setValue(manifest)
      setModified(false)
    },

    [handleOnChange, setCode, setModified, manifest],
  )

  useEffect(() => {
    if (isRefetching && (setManifest.isIdle || setManifest.isError)) {
      editorRef?.current?.setValue(manifest)
    }
  }, [isRefetching, manifest, setManifest.isIdle, setManifest.isError])

  useEffect(() => {
    editorRef.current?.setValue(manifest)
    const markers = monaco.editor
      .getModelMarkers({ owner: 'yaml' })
      .filter((m) => m.severity > 4)
    setHasError(markers.length !== 0)
    setModified(false)
  }, [manifest, setHasError])

  return (
    <PropertiesContainer>
      <ControlsContainer>
        <ButtonsContainer>
          <SaveButton
            disabled={!modified || hasError || setManifest.isPending}
            variant="primary"
            onClick={saveCode}
          >
            <Image alt="plus" src={save}></Image>&nbsp;&nbsp;Save
          </SaveButton>
          <Button
            variant="secondary"
            onClick={() => {
              resetCode()
              setVisible(false)
            }}
          >
            Cancel
          </Button>
        </ButtonsContainer>
      </ControlsContainer>
      <StyledEditor>
        <MonacoEditor
          beforeMount={handleEditorWillMount}
          defaultLanguage="yaml"
          layoutOptions={{
            automaticLayout: true,
          }}
          modelPath="manifest.yaml"
          onMount={handleEditorDidMount}
        />
      </StyledEditor>
    </PropertiesContainer>
  )
}

export default ModelEditor
