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
	editor = notepad --wait
```

> Seguindo o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
