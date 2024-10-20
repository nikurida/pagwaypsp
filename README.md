## Introdução

Este projeto teve o objetivo de explorar os conhecimentos em arquitetura de microserviços com event driven, além de exercitar também alguns conhecimentos em DevOps. O core do projeto é processar "transações de pagamento".

## Stacks utilizadas

- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) NestJS
- ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white) RabbitMQ
- ![Postgres](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) Postgres
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) Docker
- ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white) Docker Compose
- ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white) Grafana
- ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white) Prometheus
- ![Portainer](https://img.shields.io/badge/Portainer-13BEF9?style=for-the-badge&logo=portainer&logoColor=white) Portainer
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) Swagger
- ![TypeORM](https://img.shields.io/badge/TypeORM-FF6A00?style=for-the-badge&logo=typeorm&logoColor=white) TypeORM

## Pré-requisitos

- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) Docker
- ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white) Docker Compose
- ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) npm


## Instalação de dependências

```bash
$ npm install
```

## Rodando o projeto

```bash
$ docker compose up --build
```

## URLs

- RabbitMQ: <http://localhost:15672>
- Postgres: <http://localhost:5432>
- Swagger: <http://localhost:3000/api>
- Grafana: <http://localhost:3030>
- Portainer: <http://localhost:9000>
- Prometheus: <http://localhost:9090>

## Dados de acesso

- RabbitMQ:
  - user: user
  - password: password

- Grafana:
  - user: admin
  - password: admin

- Postgres:
  - user: user
  - password: password
  - db: pagwaydb

Qualquer coisa só seguir o env.sample.

## Grafana

Para visualizar as metricas da aplicação você precisará adicionar o prometheus no datasource do Grafana, e configurar o dashboard conforme o seu gosto.
