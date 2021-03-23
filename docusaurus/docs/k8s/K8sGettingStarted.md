---
id: K8sGettingStarted
title: Getting Started
---

Let's deploy a full-stack application on kubernetes locally with minikube.

- a frontend (React)
- a backend (Node.js)
- an SQL database (postgres)
- Key/Value, Pub/Sub (redis)

## Requirements

Ensure **kubectl** and **minikube** is started with the ingress addon: [K8s Requirements](./K8sRequirements.md)

### Getting the code

Install the _grucloud_ command line utility: **gc**

```bash
npm i -g @grucloud/core
```

Clone the source code containing the examples:

```bash
git clone git@github.com:grucloud/grucloud.git
```

Change the k8s minikube directory

```bash
cd grucloud/examples/k8s/starhackit/minikube
```

Install the node dependencies:

```bash
npm install
```

### config.js

Edit **config.js** and eventually change the configuration.

## Plan

Find out which resources are going to be allocated:

```bash
gc plan
```

## Deploy

Happy with the expected plan ? Deploy it now:

```bash
gc deploy
```

## List

List all the resources:

```bash
gc list
```

## Destroy

Time to destroy the resources allocated:

```bash
gc destroy
```