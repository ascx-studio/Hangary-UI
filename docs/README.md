# Item documentation

Edit the MDX file in the matching category folder. Each file contains overview, usage, and setup notes; the shared page supplies the title, preview, installation command, and source files from the registry.

When adding a registry item, add its MDX file and loader to `docs/index.ts`. Templates use `docs/templates/` and import their documentation in the template route.

Keep examples aligned with the installed entry file. Preview layouts and demos live in `components/registry/`; installable components live in the root `registry/`.
