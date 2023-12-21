This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Cíclo de vida

### Cadastro

- Usuário entra no site e cai no login
- Clica em cadastrar e na tela de cadastro informa nome, e-mail e senha
- Recebe um e-mail de confirmação
- Ativa a conta

### Login

- Ao ir para a home se não tiver autenticado é redirecionado para o login
- Ao fazer login é redirecionado para a home

### Criar partida

- Ao entrar na home se não tiver participando de nenhum campeonato é redirecionado para a lista de campeonatos abertos
- Clique em Criar campeonato

### Entrar em um campeonato

- Ao entrar na home se não tiver participando de nenhum campeonato é redirecionado para a lista de campeonatos abertos
- Selecione um campeonato e clique em participar
- Isso irá vincular o jogador ao campeonato, permitindo que ele liste todos os participantes na home
- Caso a data de inscrição já tenha passado, não será mais possível entrar

### Campeonatos encerrados

- Um campeonato encerrado não será mais carregado na home

### Data final

- A data final de um campeonato define o ultimo dia que será possível enviar dados para aquele campeonato
