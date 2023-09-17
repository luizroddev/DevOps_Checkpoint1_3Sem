# Aplicação de Controle de Transações Bancárias

Esta é uma aplicação de controle de transações bancárias desenvolvida em Node.js utilizando o framework Express e um banco de dados PostgreSQL. Ela permite a realização das seguintes operações:

## Listar Depósitos

Endpoint: `/depositos`

Esta rota permite listar todos os depósitos registrados no sistema.

## Listar Depósitos de um Usuário Específico

Endpoint: `/depositos/:usuario_id`

Esta rota permite listar todos os depósitos de um usuário específico com base no `usuario_id`.

## Criar Depósito em uma Conta

Endpoint: `/depositos`

Esta rota permite criar um depósito em uma conta. Para isso, é necessário fornecer o `usuario_id` do destinatário e o valor a ser depositado. A operação inclui a verificação da existência do usuário e a atualização do saldo.

## Listar Transações

Endpoint: `/transacoes`

Esta rota permite listar todas as transações registradas no sistema.

## Listar Transações de um Usuário Específico

Endpoint: `/transacoes/:usuario_id`

Esta rota permite listar todas as transações de um usuário específico com base no `usuario_id`.

## Criar Transação entre Usuários

Endpoint: `/transacoes`

Esta rota permite criar uma transação entre dois usuários. É necessário fornecer o `remetente_id`, `destinatario_id` e o valor da transação. A operação inclui verificação da existência dos usuários, saldo suficiente do remetente e a atualização dos saldos.

## Criar Usuário com Saldo Padrão

Endpoint: `/usuarios`

Esta rota permite criar um usuário com um saldo padrão. É necessário fornecer o `nome`, `email` e `saldo` do novo usuário. Antes da criação, a rota verifica se já existe um usuário com o mesmo email.

## Listar Todos os Usuários

Endpoint: `/usuarios`

Esta rota permite listar todos os usuários registrados no sistema.

## Configuração do Banco de Dados

Certifique-se de configurar corretamente a conexão com o banco de dados PostgreSQL no arquivo `database/postgresql.js`.

## Executando a Aplicação

Para executar a aplicação, você pode utilizar o comando:

```npm start```

Isso iniciará o servidor Express.

Lembre-se de configurar as variáveis de ambiente necessárias, como a porta em que o servidor irá escutar.


