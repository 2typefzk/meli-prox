# meli-prox

Design system reverso do Mercado Pago / Mercado Livre e protótipo navegável do **Aproxime** (pagar, transferir e receber por aproximação) com a funcionalidade **Perto de mim**.

> Projeto de estudo/case. Não é afiliado ao Mercado Livre nem ao Mercado Pago. Todos os nomes, telefones, chaves Pix e valores do protótipo são fictícios.

## Estrutura

| Pasta | O que tem |
| --- | --- |
| `DESIGN.md` | Documentação do design system (tokens, tipografia, espaçamento, componentes, tom) |
| `tokens/` | Fonte única dos tokens → CSS (`tokens.css`), DTCG e variáveis do Figma |
| `storybook/src/` | Componentes React do DS + stories |
| `storybook/prototype/` | Protótipo (Vite + React) |

## Rodar localmente

```bash
cd storybook
npm install
npm run prototype      # http://localhost:5199
npm run storybook      # http://localhost:6006
```

O protótipo pede uma senha de acesso antes de abrir (cortina simples no cliente, não é uma proteção real).

## Deploy

A Vercel usa `vercel.json`: o protótipo vai para a raiz do site e o Storybook para `/storybook`.
