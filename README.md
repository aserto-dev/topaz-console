# Topaz Console

A modern web console for [Topaz](https://github.com/aserto-dev/topaz)

## 📋 Prerequisites

- Node.js (LTS version recommended)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone git@github.com:aserto-dev/topaz-console.git
cd topaz-console
```

2. Install dependencies:
```bash
yarn install
```
## ENV

Check `.env` file
```sh
VITE_REACT_APP_DISCOVERY_SERVICE_URL #topaz console service gateway address
```
## 🚀 Development

To start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 📦 Build

To create a production build:

```bash
yarn build
```

The build output will be in the `dist` directory.

## 🧪 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Create production build
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn check` - TypeScript type checking
- `yarn generate:rest` - Generate REST API types
- `yarn detect-unused-exports` - Detect unused exports


## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components, Bootstrap
- **State Management**: React Query
- **Routing**: React Router
- **API Client**: Orval
- **Linting**: ESLint
- **Formatting**: Prettier

## 📚 Documentation
- [Topaz](https://www.topaz.sh/docs/getting-started)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Styled Components Documentation](https://styled-components.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.
