# Alias para o git

Para inserir alias de comando git, insira no arquivo de configuração:

```bash
[alias]
	s = !git status -s
	c = !git add --all && git commit -m
	l = !git log --pretty=format:'%C(blue)%h%C(red)%d %C(white)%s - %C(cyan)%cn, %C(green)%cr'
```

> Para editar a configurações locais use: `git config --local --edit`

Para alterar o editor padrão do git, insira no arquivo de configuração:

```bash
[core]
	editor = code --wait
```

Para sempre realizar o push com as tags, insira no arquivo de configuração:

```bash
[push]
    followTags = true
```

> Seria o equivalente a `git push origin main --follow-tags`

# Padronização das mensagens dos commits

Seguindo o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

# Container Docker para o MongoDB

`docker run --name some-mongo -p 27017:27017 -d mongo`

# Dockerize

## build

Para construir a imagem, use:

`docker build -t clean-node-api .`

> Antes de construir a imagem Docker, é necessário "compilar" o projeto de Typescript para Javascript.

## run

Para criar um container com a imagem criada, use:

`docker run -d -p 5050:5050 clean-node-api npm run debug`

A imagem não contém comando incluso para iniciar a aplicação automaticamente, por isso `npm run debug` é incluído no final do arquivo.

> Lembrando que é possível ajustar as variáveis de ambiente, adicionando `-e MONGO_URL=mongodb://localhost:27017/clean-node-api?readPreference=primary&directConnection=true&ssl=false` por exemplo ao comando

> docker-composer também disponível, já conectando a imagem do projeto com um container do MongoDB.
