# Usa a imagem oficial do Node.js 22 (LTS)
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências (incluindo devDependencies se necessário)
RUN npm install --production

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta que a aplicação vai rodar (ajuste conforme necessário)
EXPOSE 80

# Comando para iniciar a aplicação (ajuste para o seu entrypoint)
CMD ["node", "app.js"]