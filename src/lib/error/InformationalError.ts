export class InformationalError extends Error {
  constructor(
    message: string,
    public title: string
  ) {
    super(message)
  }
}
