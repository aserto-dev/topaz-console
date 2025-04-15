import * as monaco from 'monaco-editor'
import React from 'react'

import Editor, { Monaco } from '@monaco-editor/react'

import { theme } from '../../../theme'
import YamlWorker from './yaml.worker.js?worker'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    const getWorkerModule = (moduleUrl: string, label: string) => {
      const workerUrl = self.MonacoEnvironment?.getWorkerUrl?.(
        workerId,
        moduleUrl,
      )
      if (!workerUrl) {
        throw new Error('Failed to get worker URL')
      }
      return new Worker(workerUrl, {
        name: label,
        type: 'module',
      })
    }
    switch (label) {
      case 'yaml':
        return new YamlWorker()
      default:
        return getWorkerModule(
          '/monaco-editor/esm/vs/editor/editor.worker?worker',
          label,
        )
    }
  },
}

const VsCodeTopaz = [
  { foreground: '#5c6773', token: '' },
  { foreground: theme.mojoAccent2, token: 'invalid' },
  { fontStyle: 'italic', token: 'emphasis' },
  { fontStyle: 'bold', token: 'strong' },
  { foreground: '#5c6773', token: 'variable' },
  { foreground: '#5c6773', token: 'variable.predefined' },
  { foreground: '#f08c36', token: 'constant' },
  { fontStyle: 'italic', foreground: theme.grey70, token: 'comment' },
  { foreground: '#f08c36', token: 'number' },
  { foreground: '#f08c36', token: 'number.hex' },
  { foreground: '#4dbf99', token: 'regexp' },
  { foreground: '#00a8ff', token: 'annotation' },
  { foreground: '#00a8ff', token: 'type' },
  { foreground: '#5c6773', token: 'delimiter' },
  { foreground: '#5c6773', token: 'delimiter.html' },
  { foreground: '#5c6773', token: 'delimiter.xml' },
  { foreground: theme.cooperAccent4, token: 'tag' },
  { foreground: theme.cooperAccent4, token: 'tag.id.jade' },
  { foreground: theme.cooperAccent4, token: 'tag.class.jade' },
  { foreground: theme.cooperAccent4, token: 'meta.scss' },
  { foreground: theme.cooperAccent4, token: 'metatag' },
  { foreground: theme.appleAccent4, token: 'metatag.content.html' },
  { foreground: theme.cooperAccent4, token: 'metatag.html' },
  { foreground: theme.cooperAccent4, token: 'metatag.xml' },
  { fontStyle: 'bold', token: 'metatag.php' },
  { foreground: '#00a8ff', token: 'key' },
  { foreground: '#00a8ff', token: 'string.key.json' },
  { foreground: theme.appleAccent4, token: 'string.value.json' },
  { foreground: '#f08c36', token: 'attribute.name' },
  { foreground: '#0451A5', token: 'attribute.value' },
  { foreground: '#abb0b6', token: 'attribute.value.number' },
  { foreground: theme.appleAccent4, token: 'attribute.value.unit' },
  { foreground: theme.appleAccent4, token: 'attribute.value.html' },
  { foreground: theme.appleAccent4, token: 'attribute.value.xml' },
  { foreground: theme.appleAccent4, token: 'string' },
  { foreground: theme.appleAccent4, token: 'string.html' },
  { foreground: theme.appleAccent4, token: 'string.sql' },
  { foreground: theme.appleAccent4, token: 'string.yaml' },
  { foreground: '#f2590c', token: 'keyword' },
  { foreground: '#f2590c', token: 'keyword.json' },
  { foreground: '#f2590c', token: 'keyword.flow' },
  { foreground: '#f2590c', token: 'keyword.flow.scss' },
  { foreground: '#666666', token: 'operator.scss' },
  { foreground: '#778899', token: 'operator.sql' },
  { foreground: '#666666', token: 'operator.swift' },
  { foreground: '#FF00FF', token: 'predefined.sql' },
]

type MonacoEditorProps = {
  beforeMount?: (monaco: Monaco) => void
  defaultLanguage: string
  defaultValue?: string
  layoutOptions?: monaco.editor.IStandaloneEditorConstructionOptions
  modelPath?: string
  onMount?: (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => void
  themeRules?: monaco.editor.ITokenThemeRule[]
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  beforeMount,
  defaultLanguage,
  defaultValue,
  layoutOptions,
  modelPath,
  onMount,
  themeRules,
}) => {
  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.getModels().forEach((model) => model.dispose())
    beforeMount?.(monaco)
    monaco.editor.defineTheme('topaz', {
      base: 'vs-dark',
      colors: {
        'editor.background': theme.primaryBlack,
        'editor.foreground': '#5c6773',
        'editorBracketHighlight.foreground1': theme.grey90,
        'editorBracketHighlight.foreground2': theme.grey90,
        'editorBracketHighlight.foreground3': theme.grey90,
        'editorBracketHighlight.foreground4': theme.grey90,
        'editorBracketHighlight.foreground5': theme.grey90,
        'editorBracketHighlight.foreground6': theme.grey90,
        'editorBracketHighlight.unexpectedBracket.foreground': theme.grey90,
        'editorIndentGuide.activeBackground': theme.indogo30,
        'editorIndentGuide.background': theme.indogo20,
      },
      inherit: true,
      rules: [...VsCodeTopaz, ...(themeRules || [])],
    })
  }

  return (
    <Editor
      beforeMount={handleEditorWillMount}
      defaultLanguage={defaultLanguage}
      defaultValue={defaultValue}
      options={layoutOptions}
      path={modelPath}
      onMount={onMount}
    />
  )
}

export default MonacoEditor
