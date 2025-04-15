/// <reference types="vite/client" />

declare global {
  declare module 'react' {

declare namespace JSX {
  interface IntrinsicElements {
    'rapi-doc': {
      id?: string
      ref?: React.Ref<RapiDocElement>
      theme?: string
    }
  }
}

  }
}
