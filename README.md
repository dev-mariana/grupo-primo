# Sistema de Transações Bancárias

Este projeto implementa um sistema básico de transações bancárias com funcionalidades de criação de contas, depósitos, saques e transferências entre contas. O sistema é desenvolvido em TypeScript, utilizando Fastify, Prisma e PostgreSQL, com tratamento de concorrência e robustez contra falhas de rede.

## Funcionalidades

- **Cadastro de Conta Bancária**: Permite criar novas contas com um saldo inicial.
- **Transações Bancárias**: Suporte para depósito, saque e transferência entre contas.
- **Concorrência e Consistência**: Garante a integridade do saldo das contas em operações simultâneas.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **PostgreSQL**
- **NPM** ou **Yarn** para gerenciamento de pacotes

## Configuração do Ambiente

1. Clone o repositório para sua máquina local:

   ```bash
   git clone https://github.com/dev-mariana/grupo-primo.git
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd grupo-primo
   ```

3. Instale as dependências:

   ```bash
   npm install ou yarn install
   ```

4. Crie um arquivo .env na raiz do projeto e coloque as variáveis de ambiente:

   - DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
   - NODE_ENV="development"
   - PORT=3000

## Configuração do Banco de Dados

1. Criar o banco de dados via Docker:

   ```bash
   docker compose up -d
   ```

2. Rodar as migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

## Executando o Projeto

1. Iniciar o servidor:

   ```bash
   npm run dev ou yarn install
   ```

## Testrando os Endpoints

- Registrar conta:

```json
{
  "number": 123,
  "balance": 1000
}
```

- Fazer deposito de uma conta já existente:

```json
{
  "accountNumber": 123,
  "amount": 100
}
```

- Fazer saque de uma conta já existente:

```json
{
  "accountNumber": 123,
  "amount": 50
}
```

- Fazer transferência entre duas contas:

```json
{
  "fromAccount": 123,
  "toAccount": 456,
  "amount": 30
}
```
