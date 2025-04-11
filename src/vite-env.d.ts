/// <reference types="vite/client" />

declare global {
  declare module 'react' {

declare namespace JSX {
  interface IntrinsicElements {
    'rapi-doc': {
      id?: string
      theme?: string
      ref?: React.Ref<RapiDocElement>
    }
  }
}

  }
}
