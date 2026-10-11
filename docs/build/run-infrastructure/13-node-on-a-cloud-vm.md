---
title: Node on a cloud VM
description: "Sizing, disks, firewall and snapshots for a Verana node on OVHcloud, AWS, Google Cloud or Azure."
sidebar_position: 13
persona: operator
surface: shell
verified_on: pending
---

# Node on a cloud VM

A node runs on a plain virtual machine; Kubernetes adds nothing for a single validator. Terraform for each provider is being assembled in [verana-deploy-examples](https://github.com/verana-labs/verana-deploy-examples) under `node/`; this page gives the sizing.

| | Full node (RPC for your own services) | Validator |
|---|---|---|
| CPU, memory | 4 vCPU, 8 GB | 4 vCPU, 16 GB |
| Disk | 200 GB SSD, grows with chain history | same, plus a separate volume for backups |
| Network | 26656 open to peers; 26657 and 1317 only to your services | 26656 to your sentries only; no public RPC |
| Snapshots | daily disk snapshot | daily, plus key material in offline custody |

Providers: OVHcloud Public Cloud `b3-16` or a dedicated server; AWS `m6i.xlarge` with `gp3`; Google Cloud `n2-standard-4` with `pd-ssd`; Azure `Standard_D4s_v5` with Premium SSD. Pick the region closest to your sentries.

Then follow [Join testnet](./run-a-node/50-join-testnet.md) and, for validators, [Become a validator](./run-a-node/60-join-validator.md) and the [sentry architecture](./run-a-node/70-sentry-architecture.md).
