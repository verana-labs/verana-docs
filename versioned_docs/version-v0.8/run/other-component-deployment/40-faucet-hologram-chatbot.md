# Faucet Chatbot

The Verana faucet is packaged as an [Hologram Messaging](https://www.hologram.xyz/) chatbot that mints small VNA allocations to any address on the public testnet. It is the quickest way for developers to fund wallets so they can broadcast transactions while experimenting with registries, schemas, or verifiable services. The [official component catalog](https://verana.io/page/developers/components/) lists it alongside the rest of the supporting services.

## How it works

- Users open a conversation with the chatbot and submit `/to <verana address>`.
- The bot validates the address, signs a faucet transaction, and broadcasts it against the configured RPC endpoint.
- Successful drops are logged so you can enforce rate limits or daily caps.

## Operational considerations

- **Rate limiting:** Add per-address and per-account throttles to prevent draining the faucet wallet.
- **Wallet management:** Keep the faucet key isolated (KMS or HSM) and top it up periodically from a more secure treasury account.
- **Observability:** Export metrics for request count, success/failure, and remaining balance so you can react before users run out of tokens.

Full deployment steps (Docker/Kubernetes manifests, environment variables, etc.) will be added to this guide soon. For now, use these notes plus the repository README (`verana-labs/verana-faucet-hologram-chatbot`) to bootstrap your own faucet instance.
