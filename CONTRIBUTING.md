# Contribution Guidelines

Please read this guide if you're interested in contributing to graphqlgen.

**We welcome any form of contribution, especially from new members of our community** 💚

## Discussions

**Our community is a safe and friendly environment, where we support and treat each other with respect**.

We invite you to actively participate in discussions on Github, [the Forum](https://www.prisma.io/forum/) and [Slack](https://slack.prisma.io/).

You'll see many discussions about usage or design questions, but any topic is welcome.
They are a great foundation to find potential issues, feature requests or documentation improvements.

## Design principles

1. **Embrace code redundancy**. Opposing to the generally desired DRY principle, in the case of generated code, it's more important to be readable and to provide as much context as possible without the need to navigate a lot through the code first. (This also allows for more helpful auto-completion/intellisense.)

2. **Graphqlgen should be as unopiniated as possible**. Every design decisions matter and should be carefully thought.

## Issues

To report a bug, you can use [this template](https://github.com/prisma/graphqlgen/issues/new?template=bug_report.md).

When you're starting to look into fixing a bug, create a WIP PR that you mention in the original issue. This way, we ensure that everyone interested can share their thoughts, and duplicate work is prevented.

Adding tests is a great way to help preventing future bugs.

## Documentation

You can either improve existing content or add new resources. If you miss a particular information in [the reference documentation](https://oss.prisma.io/graphqlgen/), feel free to either create an issue or PR. 

## Features

To request a new feature, you can use [this template](https://github.com/prisma/graphqlgen/issues/new?template=feature_request.md).

To contribute features or API changes, it's best to start a discussion in an issue first, ideally with a proposal. This allows everyone to participate and ensures that no potential implementation work is in vain.

## Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes or improvements or alternatives, but for small changes
your pull request should be accepted quickly.

## Logistics

Below are a series of steps to help you from a more "practical" perspective. If you need additional help concerning Git, Github has some great guides that you may want to check out! Check them out [here](https://guides.github.com/)

**Fork the repo and then clone your fork**

SSH:
```sh
git clone git@github.com:YOUR_USERNAME/graphqlgen.git
```

HTTPS:
```sh
git clone https://github.com/YOUR_USERNAME/graphqlgen.git
```

**Add the remote upstream**

```sh
git remote add upstream git://github.com/prisma/graphqlgen.git
```

**Fetch changes from upstream**

```sh
git fetch upstream
```

**Pull changes locally**

```sh
git pull upstream master
```

**Push changes up**

```sh
git push
```
