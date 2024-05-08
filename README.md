# Projeto Pagway

Este projeto consiste em uma arquitetura de microserviços com event driven, utilizando NestJS, Docker, RabbitMQ, Postgres e TypeORM para processar "transações de pagamento".

## Pré-requisitos

- Docker
- Docker Compose
- npm

## Instalação de dependências

```bash
$ npm install
```

## Rodando o projeto

```bash
# development
$ docker compose up --build
```

## URLs

- RabbitMQ: <http://localhost:15672>
- Postgres: <http://localhost:5432>
- Swagger: <http://localhost:4000/api>

## Dados de acesso

- RabbitMQ:
  - user: user
  - password: password
- Postgres:
  - user: user
  - password: password
  - db: pagwaydb

Qualquer coisa só seguir o env.sample.
