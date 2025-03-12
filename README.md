![header-igor-projetos](./assets/src/img/github-projetcs-header.jpg)

# Nestjs Project - Integration with Jest + Coverage + SonarQube + ArgoCD

[![CI - sonar cloud](https://github.com/storage-app-br/schedeasy-simple-api/actions/workflows/main.yml/badge.svg)](https://github.com/storage-app-br/schedeasy-simple-api/actions/workflows/main.yml)

## 1️⃣ Configuração do banco de dados
Este projeto utiliza o banco de dados postgresql. Para rodar o banco de dados localmente, você pode utilizar o docker. Caso não tenha um banco de dados postgres que rode localmente, você pode seguir as instruções desse [repositório](https://github.com/igor-rl/postgresql).

**Crie o banco de dados `simple_schedeasy`**
```bash
docker exec -it postgresql psql -U pguser -d postgres
CREATE DATABASE simple_schedeasy;
```
## 2️⃣ Prometheus e Grafana
Use helm para instalar o prometheus e o grafana no cluster k8s. Caso ainda não tenha o helm instalado, você pode seguir as instruções:
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm installed into /usr/local/bin/helm
```
**Instalação do Prometheus e Grafana com helm**
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```
**Instalação do Prometheus**
```bash
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
```
**Instalação do Grafana**
```bash
helm install grafana grafana/grafana --namespace monitoring
```
**Revelar a senha do grafana**
```bash
kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

**Acessar o grafana**
```bash
export POD_NAME=$(kubectl get pods --namespace monitoring -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace monitoring port-forward $POD_NAME 3000
```
Acesse o grafana em `http://localhost:3000` e faça login com o usuário `admin` e a senha revelada.

## 2️⃣ Configuração do GitHub Actions Exporter


Este projeto utiliza o sonarqube para análise de código. Para rodar o sonarqube localmente, você pode utilizar o docker. Caso não tenha o sonarqube instalado, você pode seguir as instruções desse [repositório](

## Execute o projeto
**Clonar o projeto**
```bash
gh repo fork https://github.com/storage-app-br/schedeasy-simple-api --clone=true
gh repo clone https://github.com/<your-git-user>/schedeasy-simple-api
git cd schedeasy-simple-api
```

**Instalar as dependências**
```bash
yarn install
```

3️⃣ **Rodar o projeto**
```bash
yarn dev
```

## Testes
**Run tests coverage**
```bash
yarn test:cov
```

## ArgoCD

1️⃣ **Instalar o argocd no cluster k8s**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

2️⃣ **Revelar a senha do argocd**
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

3️⃣ **Acessar o argocd**
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

4️⃣ **Configurar o argocd**

Crie um novo projeto no argocd e adicione e configure o repositório do projeto.

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Igor_Lage-blue?style=social&logo=github)](https://github.com/igor-rl) 

![Static Badge](https://img.shields.io/badge/10--03--2025-black)


</div>
