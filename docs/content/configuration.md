# Configuration: `graphqlgen.yml`

### Name

The configuration file must be called **`graphqlgen.yml`**.

### Reference

- `language`: The target programming language for the generated code. Possible values: `typescript`.
- `schema`: The file path pointing to your GraphQL schema file.
- `context`: Points to the definition of the `context` object that's passed through your GraphQL resolver chain.
- `models`: A mapping from types in your GraphQL schema to the models defined in your programming language. Learn more about [_models_](#models).
- `output`: Specifies where the generated type definitions and _default_ resolver implementations should be located. Must point to a **single file**.
- `resolver-scaffolding`: An object with two properties
  - `output`: Specifies where the scaffolded resolvers should be located. Must point to a **directory**.
  - `layout`: Specifies the [_layout_](#layouts) for the generated files. Possible values: `file-per-type` (more layouts [coming soon](https://github.com/prisma/graphqlgen/issues/106): `single-file`, `file-per-type-classes`, `single-file-classes`).

Whether a property is required or not depends on whether you're doing [Generation](#generation) or [Scaffolding](#scaffolding).

### Models

Models represent domain objects in TypeScript:

- Models are **not necessarily** 1-to-1 mappings to your database structures, **but can be**.
- Models are **not necessarily** the types from your GraphQL schema, **but can be**.

When starting a new project, it is often the case that models look _very_ similar to to the SDL types in your GraphQL schema. Only as a project grows, it is often useful to decouple the TypeScript representation of an object from the way it's exposed through the API.

Consider an example where you have a `User` model with a `password` field. The `password` field most likely should not be exposed through the API, but it's still required within yout code. In that case, the model differs from the SDL type representation in the GraphQL schema.

### Layouts

There are four layouts that can be applied when scaffolding resolver skeletons:

- `file-per-type`: Generates one file per SDL type and puts the corresponding resolvers into it.
- `single-file` (coming soon): Generates _all_ resolvers in a single file.
- `file-per-type-classes` (coming soon): Same as `file-per-type` but generates resolvers as TypeScript classes instead of plain objects.
- `single-file-classes` (coming soon): Same as `single-file` but generates resolvers as TypeScript classes instead of plain objects.

See [this](https://github.com/prisma/graphqlgen/issues/106) issue to learn more about the upcoming layouts.