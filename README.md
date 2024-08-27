<p align="center"><strong>Backend Processo Seletivo Verzel.</strong></p>

<p align="center">
  <a href="#get-started"><strong>Get Started</strong></a> ·
  <a href="#decisões"><strong>Decisões</strong></a> ·
  <a href="#deployment"><strong>Considerações</strong></a>
</p>

<br/>

## Get Started

LINK PARA <a href="https://youtu.be/ATgcJQ5G32c" target="_blank"> VIDEO </a> APRESENTAÇÃO

Para rodar, primeiro, crie um .env com as variáveis que preferir,
no .env.example tem as variáveis necessárias e qual o formato delas.
abra o terminal na pasta do projeto e,

Instale as dependências:

```shell
npm install
```

para executar em modo desenvolvedor:

```shell
npm run dev
```

> _Note_: Para o acesso visual do endpoint com todas as features, é recomendado acessar pelo <a href="https://github.com/GuPoroca/projeto-verzel-frontend" target="_blank"> Frontend </a> ao mesmo tempo.

## Decisões

Esse Backend foi um pouco coplexo de se implementar, criei um sistema de usuários, para poder implementar outras coisas no futuro,
também tomei a liberdade de usar Prisma como ORM e um banco de dados leve SQLite para armazenar os dados.

Outras bibliotecas/middlewares usados foram:

- cors, para caso futuro de implementação de acesso restrito
- helmet, para a segurança do backend em Express
- morgan, para o log de HTTP requests

## Considerações

Gostaria de primeiramente agradecer a oportunidade de aprender fazer esse projeto, o tempo foi curto, mas
consegui implementar os requisitos, mesmo que a qualidade não esteja no meu melhor nível.

Dificuldades:

Durante a semana de desenvolvimento do desafio, minha internet falhou algumas vezes e não consegui aproveitar tanto o tempo.
Não consegui fazer upload do projeto para a Vercel, tentei seguir dezenas de tutoriais para dar deploy no backend em node-express,
mas ele não consegue corresponder as requisições da API.

- GitFlow: 

Tomei a liberdade nesse projeto já que era individual e não estava em produção para usar a branch main como
se fosse a develop.
