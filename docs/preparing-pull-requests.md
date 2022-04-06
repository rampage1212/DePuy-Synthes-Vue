# Preparing Pull Requests in Bitbucket

Changes should be done in a Feature Branch & submitted to "development" branch as a Pull Request.

Branch names to create:

- bugfix/*
- feature/*
- hotfix/*

All commits should be digitally signed with:

Git user name and email should be set in the following format, with JnJ account:

```bash
git config user.name "Zewdu, Melaku [ETHUS NON-J&J]"
git config user.email "mzewdu@its.jnj.com"

git commit -m "commit message" -S
```

To sign commits in wsl, this initial setup is needed:
`export GPG_TTY=$(tty)`
