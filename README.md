# 5ciastek / KoPieC OS

Bakery tools and the foundation for KoPieC OS: recipes, scaling, production and workforce planning. Backlog specifications describe intended capabilities, not proof that they are implemented.

## Start here

- [Documentation index](docs/index.md): current setup, commands, engineering guidance and task-specific reading route.
- [Agent entry](AGENTS.md): the same route for implementation agents.
- [Specification style](docs/specification-style.md): Polish business/UI specifications, atomic requirements and demonstrable tasks.

## Local development

Install the dependencies declared in [package.json](package.json) with `npm install`, then run:

```bash
npm run dev
```

The development server uses port 3000. Production start is a separate workflow: run `npm run build` before `npm run start`. See the [command inventory](docs/index.md#commands) for preview and tests.

The current application uses React 19, TanStack Start/Router and Vite 7. Next.js/Payload are target architecture work: [#13](https://github.com/slawinski/5ciastek/issues/13) selects the architecture and [#16](https://github.com/slawinski/5ciastek/issues/16) performs the migration. Ordinary maintenance is not permission to migrate.
