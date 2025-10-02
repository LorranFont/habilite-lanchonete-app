# Habilite Menu (Expo + NativeWind)

App de **lanchonete da Autoescola Habilite** 🍔 integrado ao fluxo de pedidos.  
Stack: **Expo (React Native)** + **NativeWind (Tailwind p/ RN)** + **SecureStore**.

## 🚀 Como rodar

```bash
npm install
npx expo start -c

Depois escolha a plataforma (Android/iOS/Web).

📦 Tecnologias

Expo (React Native)

React Navigation

NativeWind (Tailwind para RN)

Expo SecureStore

TypeScript


🧭 Estrutura
src/pages/
  ├─ login.tsx
  ├─ register.tsx
  └─ menu.tsx

🌳 Fluxo de Branches

main → estável

develop → integração contínua

feature/* → novas features

hotfix/* → correções urgentes

📝 Commits & PRs

feat: nova feature

fix: correção

chore: manutenção

refactor: refatoração

docs: documentação

Modelo de PR:

feat: adiciona suporte ao Tailwind (NativeWind) e estiliza telas principais

### O que foi feito
- Configuração do Tailwind (NativeWind)
- Estilização inicial das telas Login, Register e Menu

### Como testar
1. Rodar `npx expo start -c`
2. Conferir se as telas estão estilizadas e navegando

### Checklist
- [x] build OK
- [x] telas renderizam
- [] estilos aplicados