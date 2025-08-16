# 📚 Sistema de Gerenciamento de Livros

Este é um sistema de gerenciamento de livros desenvolvido com **Node.js** e **TypeScript**, seguindo princípios de **Clean Architecture** e **SOLID**.
O sistema permite **cadastrar, listar, buscar, atualizar e excluir livros** através de uma **interface de linha de comando (CLI)**.

---

## 📂 Estrutura do Projeto

```bash
bookmanager/
├── sql/
│ └── init.sql                 # Script SQL para inicialização do banco de dados
├── src/
│ ├── application/             # Camada de aplicação
│ │ ├── services/              # Serviços da aplicação
│ │ └── validators/            # Validadores de dados
│ ├── config/                  # Configurações
│ ├── domain/                  # Camada de domínio
│ │ ├── dto/                   # Data Transfer Objects
│ │ ├── entities/              # Entidades de domínio
│ │ └── interfaces/            # Interfaces e contratos
│ ├── infrastructure/          # Camada de infraestrutura
│ │ ├── database/              # Implementações de acesso a dados
│ │ └── logging/               # Implementações de logging
│ ├── presentation/            # Camada de apresentação
│ │ └── cli/                   # Interface de linha de comando
│ ├── utils/                   # Utilitários
│ └── app.ts                   # Ponto de entrada da aplicação
├── tests/                     # Testes automatizados
├── docker-compose.yml         # Configuração do Docker Compose
├── Dockerfile                 # Configuração do Docker
├── jest.config.js             # Configuração do Jest para testes
└── tsconfig.json              # Configuração do TypeScript
```

---

## ⚙️ Requisitos

- **Node.js** (v14 ou superior)
- **npm** ou **yarn**
- **SQLite3**
- **Docker** (opcional)

---

## 🚀 Instalação

### 🔹 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/bookmanager.git
cd bookmanager

# Instale as dependências
npm install
ou
yarn install

# Compile o código TypeScript
npm run build
ou
yarn build

# Inicialize o banco de dados
npm run init-db
ou
yarn init-db
```

### 🔹 Usando Docker

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/bookmanager.git
cd bookmanager

# Construa e inicie os contêineres
docker-compose up -d

# Acesse o contêiner da aplicação
docker exec -it bookmanager bash
```

# ▶️ Uso

```bash
# Executando a Aplicação
npm start
ou
yarn start
```

Isso iniciará a interface de linha de comando interativa, onde você poderá:

1. 📖 Listar todos os livros.
2. 🔍 Buscar um livro por ID.
3. ➕ Cadastrar um novo livro.
4. ✏️ Atualizar um livro existente.
5. ❌ Deletar um livro.

# 📝 Exemplos de Uso

### ➕ Cadastrar um Novo Livro

Ao selecionar a opção 3 no menu principal, insira:

- Título (obrigatório)
- Autor (obrigatório)
- Ano de publicação (obrigatório)
- Editora (opcional)
- Gênero (opcional)
- Data de aquisição (opcional, formato DD/MM/YYYY)
- Número de páginas (opcional)
- Descrição (opcional)

### 🔍 Buscar um Livro por ID

Selecione a opção 2 no menu principal e insira o ID do livro.

### ✏️ Atualizar um Livro

Selecione a opção 4, insira o ID e forneça os novos dados.

### ❌ Deletar um Livro

Selecione a opção 5 e insira o ID do livro.

# ✅ Testes

```bash
# Executando Testes
npm test
ou
yarn test

# Cobertura de Testes (Para executar os testes com relatório de cobertura)
npm run test:coverage
ou
yarn test:coverage
```

Os testes cobrem:
- ✔️ Entidades e validadores (unitários)
- ✔️ Serviços (integração)
- ✔️ Repositórios

# 🗄️ Estrutura do Banco de Dados

O sistema utiliza SQLite como banco de dados. A tabela principal é:

### Tabela books

| Coluna          | Tipo     | Descrição                                   |
|-----------------|----------|---------------------------------------------|
| id              | INTEGER  | Chave primária, autoincremento              |
| title           | TEXT     | Título do livro (**obrigatório**)           |
| author          | TEXT     | Autor do livro (**obrigatório**)            |
| publicationYear | INTEGER  | Ano de publicação (**obrigatório**)         |
| publisher       | TEXT     | Editora (opcional)                          |
| genre           | TEXT     | Gênero (opcional)                           |
| acquisitionDate | TEXT     | Data de aquisição (opcional, formato `DD/MM/YYYY`) |
| pageCount       | INTEGER  | Número de páginas (opcional)                |
| description     | TEXT     | Descrição (opcional)                        |
| createdAt       | TEXT     | Data de criação                             |
| updatedAt       | TEXT     | Data de atualização (null até a primeira edição) |


# 🏛 Arquitetura

O projeto segue os princípios de Clean Architecture e SOLID:

- **Domain Layer** → Contém as entidades de negócio e interfaces de repositório.
- **Application Layer** → Contém a lógica de aplicação e serviços.
- **Infrastructure Layer** → Implementa interfaces definidas nas camadas superiores.
- **Presentation Layer** → Lida com a interação com o usuário.

# ✅ Validações
O sistema implementa as seguintes validações:

- **Título e Autor** → Campos obrigatórios, não podem estar vazios.
- **Ano de Publicação** → Deve ser um número inteiro não negativo e não maior que o ano atual.
- **Número de Páginas** → Se fornecido, deve ser um número inteiro positivo.
- **Data de Aquisição** → Se fornecida, deve estar no formato DD/MM/YYYY e não pode ser uma data futura.

# 🐳 Docker

O projeto inclui configurações para Docker:

- **Dockerfile** → Define a imagem da aplicação.
- **docker-compose.yml** → Configura o ambiente de execução.

Comandos principais:

```bash
# Construir e iniciar os contêineres
docker-compose up -d

# Parar os contêineres
docker-compose down

# Ver logs da aplicação
docker-compose logs -f app

# Executar comandos dentro do contêiner
docker exec -it bookmanager bash
```

# 📜 Scripts Disponíveis

- `npm start` → Inicia a aplicação
- `npm run build` → Compila o código TypeScript
- `npm run dev` → Executa em modo desenvolvimento
- `npm test` → Executa os testes
- `npm run test:coverage` → Testes com cobertura
- `npm run init-db` → Inicializa o banco de dados

# 📄 Licença

Este projeto está licenciado sob a licença MIT – veja o arquivo LICENSE para mais detalhes.

# 👨‍💻 Autor

Desenvolvido por Arthur Lelis

📩 Contato: arthurleliscc@gmail.com
