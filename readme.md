# FastFeetAPI
A FastFeetAPI é uma API desenvolvida para simular o funcionamento de uma transportadora, permitindo o gerenciamento completo de destinatários (recipients), transportadores (couriers) e pacotes (packages).
O objetivo principal deste projeto é aperfeiçoar habilidades com NestJS, arquitetura limpa, Domain-Driven Design, autenticação JWT e práticas modernas de desenvolvimento backend.

O projeto foi estruturado de forma didática, com foco em clareza, boas práticas e organização, facilitando tanto o aprendizado quanto a evolução contínua.


## Principais Funcionalidades
A API permite gerenciar todo o fluxo operacional de uma transportadora (assim espero...):


Recipients (Destinatários)

Registrar destinatário

Listar todos os destinatários

Listar destinatários próximos a um courier (com base em coordenadas geográficas)

Editar destinatário

Deletar destinatário


Couriers (Entregadores)
Registrar courier
Listar todos os couriers
Editar courier
Alterar somente a senha do courier
Deletar courier
Autenticar (courier/admin) via JWT


Packages (Pacotes)
Registrar um pacote para um recipient
Listar todos os pacotes associados a um courier
Editar pacote
Atualizar somente o status do pacote (rota disponível para couriers)
Deletar pacote


📡 Endpoints                          Descrição                     Role
Recipients
POST   /recipients                    - registrar recipient         - admin  
GET    /recipients                    - listar todos                - admin
GET    /recipients/nearby             - listar destinatários próximos - courier
PATCH  /recipients/:recipientId       - editar recipient            - admin
DELETE /recipients/:id                - deletar recipient           - admin


Packages
POST   /packages/:recipientId         - registrar pacote            - admin
GET    /packages/:courierId           - listar pacotes do courier   - courier
PATCH  /packages/:packageId           - editar pacote               - admin
PATCH  /packages/:packageId/status    - atualizar status            - courier 
DELETE /packages/:id                  - deletar pacote              - admin


Couriers
POST   /accounts                      - registrar courier           - admin
GET    /couriers                      - listar couriers             - admin
PATCH  /couriers/:courierId           - editar courier              - admin
PATCH  /couriers/:courierId/password  - alterar senha               - admin
DELETE /accounts/:id                  - deletar courier             - admin


Autenticação
POST /sessions                        - autenticação            courier/admin


Arquitetura do Projeto
Este projeto segue uma estrutura inspirada em DDD (Domain-Driven Design) e Clean Architecture, garantindo separação clara entre camadas e facilitando testes, manutenção e evolução.

Principais conceitos utilizados:
Domínio isolado com entidades, agregados e value-objects
Domain Events para reações automáticas no fluxo interno
Repositórios desacoplados por meio de abstrações
Mappers para conversão entre domínio ↔ persistência
Use Cases organizando a lógica de aplicação
Controllers lidando apenas com entrada/saída HTTP
Validação com Zod garantindo segurança na entrada de dados

Essa organização foi escolhida para tornar o projeto mais legível e didático, reforçando boas práticas avançadas de backend.


Tecnologias Utilizadas
Backend:
NestJS
Prisma ORM
PostgreSQL
Docker
JWT (Autenticação)
Zod (validação de schemas)
Presenters
bcryptjs
Domain Events
DDD + Clean Architecture

Testes:
Vitest
Supertest
Faker.js

Ferramentas auxiliares:
dotenv
ts-node
TypeScript
SWC


O projeto possui testes:
unitários
E2E (integrados)

Comando para testes:
Rodar testes unitários:
npm run test

Rodar testes E2E:
npm run test:e2e


Como Rodar o Projeto
1. Clone o repositório
git clone https://github.com/BregNights/FastFeetAPI-RS.git
cd FastFeetAPI

2. Instale as dependências
pnpm i

3. Configure o arquivo .env
Exemplo:
Banco de dados (Prisma)
DATABASE_URL="postgresql://postgres:docker@localhost:5432/fast-feet?schema=public"
JWT
JWT_PRIVATE_KEY=  
JWT_PUBLIC_KEY=

4. Suba o banco de dados via Docker
docker compose up -d

5. Execute as migrations
pnpm prisma migrate dev

6. Inicie o servidor

Modo desenvolvimento:
pnpm run start:dev

Produção:
pnpm run start:prod


Autenticação:
A API utiliza JWT assimétrico (chaves pública/privada).

Roles existentes:
admin, courier

Algumas rotas aceitam apenas couriers (ex: atualizar status do pacote).