# kaito-tokyo-aws

Infrastructure as code of kaito.tokyo on Amazon Web Services

## Before committing

1. `npx prettier --write .`

## Setup CloudShell

```
mkdir -p ./.bashrc.d
cat >./.bashrc.d/install-gh <<EOS
if ! command -v gh >/dev/null
then
  type -p yum-config-manager >/dev/null || sudo yum -y install yum-utils
  sudo yum-config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
  sudo yum install -y gh
fi
EOS
exec $SHELL
```
