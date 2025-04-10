import * as monaco from 'monaco-editor'
import React from 'react'
import Editor, { Monaco } from '@monaco-editor/react'

import { theme } from '../../../theme'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.MonacoEnvironment = {
  getWorker(moduleId: unknown, label: string) {
    switch (label) {
      case 'editorWorkerService':
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
      case 'yaml':
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url))
      case 'json':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url)
        )
      default:
        throw new Error(`Unknown label ${label} for moduleId: ${moduleId}`)
    }
  },
}

const VsCodeAserto = [
  { token: '', foreground: '#5c6773' },
  { token: 'invalid', foreground: theme.mojoAccent2 },
  { token: 'emphasis', fontStyle: 'italic' },
  { token: 'strong', fontStyle: 'bold' },
  { token: 'variable', foreground: '#5c6773' },
  { token: 'variable.predefined', foreground: '#5c6773' },
  { token: 'constant', foreground: '#f08c36' },
  { token: 'comment', foreground: theme.grey70, fontStyle: 'italic' },
  { token: 'number', foreground: '#f08c36' },
  { token: 'number.hex', foreground: '#f08c36' },
  { token: 'regexp', foreground: '#4dbf99' },
  { token: 'annotation', foreground: '#00a8ff' },
  { token: 'type', foreground: '#00a8ff' },
  { token: 'delimiter', foreground: '#5c6773' },
  { token: 'delimiter.html', foreground: '#5c6773' },
  { token: 'delimiter.xml', foreground: '#5c6773' },
  { token: 'tag', foreground: theme.cooperAccent4 },
  { token: 'tag.id.jade', foreground: theme.cooperAccent4 },
  { token: 'tag.class.jade', foreground: theme.cooperAccent4 },
  { token: 'meta.scss', foreground: theme.cooperAccent4 },
  { token: 'metatag', foreground: theme.cooperAccent4 },
  { token: 'metatag.content.html', foreground: theme.appleAccent4 },
  { token: 'metatag.html', foreground: theme.cooperAccent4 },
  { token: 'metatag.xml', foreground: theme.cooperAccent4 },
  { token: 'metatag.php', fontStyle: 'bold' },
  { token: 'key', foreground: '#00a8ff' },
  { token: 'string.key.json', foreground: '#00a8ff' },
  { token: 'string.value.json', foreground: theme.appleAccent4 },
  { token: 'attribute.name', foreground: '#f08c36' },
  { token: 'attribute.value', foreground: '#0451A5' },
  { token: 'attribute.value.number', foreground: '#abb0b6' },
  { token: 'attribute.value.unit', foreground: theme.appleAccent4 },
  { token: 'attribute.value.html', foreground: theme.appleAccent4 },
  { token: 'attribute.value.xml', foreground: theme.appleAccent4 },
  { token: 'string', foreground: theme.appleAccent4 },
  { token: 'string.html', foreground: theme.appleAccent4 },
  { token: 'string.sql', foreground: theme.appleAccent4 },
  { token: 'string.yaml', foreground: theme.appleAccent4 },
  { token: 'keyword', foreground: '#f2590c' },
  { token: 'keyword.json', foreground: '#f2590c' },
  { token: 'keyword.flow', foreground: '#f2590c' },
  { token: 'keyword.flow.scss', foreground: '#f2590c' },
  { token: 'operator.scss', foreground: '#666666' },
  { token: 'operator.sql', foreground: '#778899' },
  { token: 'operator.swift', foreground: '#666666' },
  { token: 'predefined.sql', foreground: '#FF00FF' },
]

type MonacoEditorProps = {
  defaultLanguage: string
  defaultValue?: string
  layoutOptions?: monaco.editor.IStandaloneEditorConstructionOptions
  modelPath?: string
  themeRules?: monaco.editor.ITokenThemeRule[]
  beforeMount?: (monaco: Monaco) => void
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  defaultLanguage,
  defaultValue,
  layoutOptions,
  modelPath,
  themeRules,
  beforeMount,
  onMount,
}) => {
  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.getModels().forEach((model) => model.dispose())
    beforeMount?.(monaco)
    monaco.editor.defineTheme('aserto', {
      base: 'vs-dark',
      inherit: true,
      rules: [...VsCodeAserto, ...(themeRules || [])],
      colors: {
        'editor.background': theme.primaryBlack,
        'editor.foreground': '#5c6773',
        'editorIndentGuide.background': theme.indogo20,
        'editorIndentGuide.activeBackground': theme.indogo30,
        'editorBracketHighlight.foreground1': theme.grey90,
        'editorBracketHighlight.foreground2': theme.grey90,
        'editorBracketHighlight.foreground3': theme.grey90,
        'editorBracketHighlight.foreground4': theme.grey90,
        'editorBracketHighlight.foreground5': theme.grey90,
        'editorBracketHighlight.foreground6': theme.grey90,
        'editorBracketHighlight.unexpectedBracket.foreground': theme.grey90,
      },
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
