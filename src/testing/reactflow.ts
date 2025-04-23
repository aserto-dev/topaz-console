class DOMMatrixReadOnly {
  m22: number
  constructor(transform: string) {
    const scale = transform?.match(/scale\(([1-9.])\)/)?.[1]
    this.m22 = scale !== undefined ? +scale : 1
  }
}

// https://reactflow.dev/learn/advanced-use/testing#using-jest
class ResizeObserver {
  callback: globalThis.ResizeObserverCallback

  constructor(callback: globalThis.ResizeObserverCallback) {
    this.callback = callback
  }

  disconnect() {}

  observe(target: Element) {
     
    this.callback([{ target } as globalThis.ResizeObserverEntry], this)
  }

  unobserve() {}
}

// Only run the shim once when requested
let init = false

export const mockReactFlow = () => {
  if (init) {
    return
  }
  init = true

  global.ResizeObserver = ResizeObserver

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.DOMMatrixReadOnly = DOMMatrixReadOnly

  Object.defineProperties(global.HTMLElement.prototype, {
    offsetHeight: {
      get() {
        return parseFloat(this.style.height) || 1
      },
    },
    offsetWidth: {
      get() {
        return parseFloat(this.style.width) || 1
      },
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global.SVGElement as any).prototype.getBBox = () => ({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  })
}
