# Dev guide

## Git workflow

The usual workflow should look like this:

1. Choosing an issue in the `ready` column in Github Project.
2. Creating a branch for this issue. You can do this either by checking out locally or by using the built-in _create a branch_ button in Github Project.
3. Resolving the issue locally.
4. Creating a Pull Request (PR) via the Github interface and assigning your peers to review your work.
5. Once the PR is validated by at least one other dev, merging the branch into the main branch.

## Local development

### Requirements

You need on your system:

- Bun
- Docker
- Python 3
- pre-commit
- uv

#### Pre-commit

```sh
pip install pre-commit
```

and then

```sh
pre-commit install --hook-type pre-commit --hook-type pre-push
```

### Client

Typescript execution & package management is handled by **bun**.

In the `client` folder

#### Install the dependencies

```bash
bun install
```

#### Run the client

```bash
bun run dev
```

### Server

Dependencies and python versions are managed via the `uv`
In the `server` folder

#### Run the API

```bash
uv run fastapi dev
```

### Run the linter

```bash
uv run ruff check
```

### Run the type checker

```bash
uv run mypy .
```

### Adding routes to the API

When you add endpoints to the API, make sure to use pydantic models for the request AND for the response. They are used for validation, but also for documentation (open-api and swagger generation). More importantly, remember to generate the client code by running:

```sh
cd client && bun run generate-client
```

### Database

The remote database is mongodb. It is dockerized so you don't have to install locally.

```bash
docker compose up -d
```

## Project architecture

### Client archi

![alt text](client-archi-story-builder.png)

### Backend archi

![alt text](server-archi-story-builder.png)
