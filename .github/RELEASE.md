# Release Process

## 1. Create Release Notes
1. [Draft a new release on Github](https://github.com/prisma/graphqlgen/releases/new)
2. `npm install -g git-release-notes`
3. Get the release notes from executing `.github/make-release-notes.sh`
4. Separate them like [here](https://github.com/prisma/graphqlgen/releases/tag/0.5.0) by Features and Fixes and add them to the draft
5. Get feedback for the draft

## 2. Publish `graphqlgen-json-schema`, if there was a change
```sh
cd ../graphqlgen-json-schema/
yarn publish --no-git-tag-version
```

## 3. Publish `create-graphqlgen`, if there was a change
```sh
cd ../create-graphqlgen
yarn publish --no-git-tag-version
```

## 4. Publish `graphqlgen`
```sh
cd ../graphqlgen/
yarn add graphqlgen-json-schema # if there was a change to graphqlgen-json-schema, add it to graphqlgen
yarn publish --no-git-tag-version
```
## 5. Push the bumped versions with `Bump to NEW_VERSION` to github

## 6. Publish the release draft on Github
