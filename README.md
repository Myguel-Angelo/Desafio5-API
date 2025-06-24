# Desafio 4 - Trilhas
## CallMed


## 💻 Guia Comandos GIT:
Fala galera! Criei esse guia de comandos git e github para mantermos uma colaboração organizada...

---
### 1. Clonar o repositório (apenas uma vez)
```bash
git clone https://github.com/sua-org/repositorio.git
cd repositorio
```
se já fizeram isso então segue abaixo

---

### 2. Verificar repositório
```bash
git pull origin main
git log
git fetch origin
```
"pull" para puxar todas as alterações já feitas, "log" pra ver, "fetch" para puxar as outras branchs remotas

---

### 3. Criar sua branch local e já conectar ao github (VER DICA 8.)
```bash
git checkout -b nome-da-sua-branch      //para criar e já selecionar
git branch -a                           //para ver as branchs
git push -u origin nome-da-sua-branch   //pra sincronizar
```

---

### 4. Fazer alterações na sua branch
depois de codar e mexer em algo
```bash
git add .
git commit -m "feat: descreva a alteração ou criação"
```
---

### 5. Subir alterações para o Github
```bash
git checkout nome-da-branch             //troca para qualquer branch que escolher (até a main)
git push origin nome-da-sua-branch
```

---

### 6. No Github abrir um Pull Request para main
- Vá para o repositório no GitHub 
- Você verá um botão “Compare & pull request” (ou vá em Pull Requests > New Pull Request)
- Selecione:
- - base: main
- - compare: sua-branch-remota (ex: LP-angelo)
- Escreva um título e uma descrição clara
- Envie o PR e avisa o pessoal que irá aprovar ou simplesmente aprove se tiver certeza do que fez

---

### 7. Atualizar o computador após o Pull Request ser aprovado
de volta ao terminal do vscode
```bash
git checkout main
git pull origin main

git checkout nome-da-sua-branch-local
git merge main
git push origin nome-da-sua-branch-remota
```

---

### 8. Dicas
Sobre as branchs:
- Nomeie a branch local com o mesmo nome da branch remota (facilita demais)

<br>

## ⚙️ Criação da API:
Aí entra o guia do Express! Sigam os passos e o resto é codar

### 1. Intalar os pacotes pra começar 
na raiz do projeto
```bash
npm install
```

---

### 2. Pra rodar o servidor
Ele fica rodando infinitamente
```bash
npm rum dev
```

para parar: CTRL + C

---