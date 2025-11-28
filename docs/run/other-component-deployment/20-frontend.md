# Frontend

This guide provides comprehensive instructions for deploying the Verana frontend application. The frontend is a Next.js application that provides a web interface for interacting with the Verana blockchain network.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Configuration Reference](#configuration-reference)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying the Verana frontend, ensure you have the following:

- **Node.js**: Version 22 or higher
- **Package Manager**: Yarn (recommended) or npm
- **Docker**: Version 20.10 or higher (for containerized deployment)
- **Kubernetes**: Version 1.24 or higher (for Kubernetes deployment)
- **Access**: Network access to Verana chain RPC and REST endpoints

### Install Yarn (Recommended)

If you don't have yarn installed, you can install it globally:

```bash
npm install --global yarn
```

---

## Environment Configuration

The frontend requires several environment variables to connect to the Verana blockchain network. These variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Base URL for the application | `http://localhost:3000` |
| `NEXT_PUBLIC_VERANA_CHAIN_ID` | Verana chain identifier | `vna-devnet-1` |
| `NEXT_PUBLIC_VERANA_CHAIN_NAME` | Human-readable chain name | `VeranaDevnet1` |
| `NEXT_PUBLIC_VERANA_RPC_ENDPOINT` | RPC endpoint URL | `http://node1.devnet.verana.network:26657` |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT` | REST API endpoint URL | `http://node1.devnet.verana.network:1317` |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_DEPOSIT` | Trust Deposit REST endpoint | `http://node1.devnet.verana.network:1317/verana/td/v1` |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_DID` | DID REST endpoint | `http://node1.devnet.verana.network:1317/verana/dd/v1` |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_REGISTRY` | Trust Registry REST endpoint | `http://node1.devnet.verana.network:1317/verana/tr/v1` |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_CREDENTIAL_SCHEMA` | Credential Schema REST endpoint | `http://node1.devnet.verana.network:1317/verana/cs/v1` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_PORT` | Port displayed/consumed by the frontend bundle | `3000` |

### Server Runtime Variables

These variables are only read by the Next.js server process. They are **not** exposed to the browser bundle, so they do not use the `NEXT_PUBLIC_` prefix.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port used by `next dev`/`next start` | `3000` |

> Use `PORT` (or `next dev --port <value>`) to change the port the Node.js server binds to. `NEXT_PUBLIC_PORT` is still useful for generating links or displaying the port inside the UI (and is dynamically substituted in our Docker/Kubernetes images), but it does not affect the server listener.

> **How the Docker/Kubernetes images work:** the build stage leaves placeholder values like `APP_NEXT_PUBLIC_PORT` inside `.next`. At runtime, `entrypoint.sh` replaces those placeholders with the current `NEXT_PUBLIC_*` values, so the container only needs those variables to update the browser bundle. The Node.js server still listens on `PORT` (default 3000); most clusters just expose that port through a Service or `-p` mapping without overriding it.

### Environment Examples

#### Devnet Configuration

```bash
NEXT_PUBLIC_VERANA_CHAIN_ID=vna-devnet-1
NEXT_PUBLIC_VERANA_CHAIN_NAME=VeranaDevnet1
NEXT_PUBLIC_VERANA_RPC_ENDPOINT=http://node1.devnet.verana.network:26657
NEXT_PUBLIC_VERANA_REST_ENDPOINT=http://node1.devnet.verana.network:1317
NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_DEPOSIT=http://node1.devnet.verana.network:1317/verana/td/v1
NEXT_PUBLIC_VERANA_REST_ENDPOINT_DID=http://node1.devnet.verana.network:1317/verana/dd/v1
NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_REGISTRY=http://node1.devnet.verana.network:1317/verana/tr/v1
NEXT_PUBLIC_VERANA_REST_ENDPOINT_CREDENTIAL_SCHEMA=http://node1.devnet.verana.network:1317/verana/cs/v1
```

#### Testnet Configuration

```bash
NEXT_PUBLIC_VERANA_CHAIN_ID=vna-testnet-1
NEXT_PUBLIC_VERANA_CHAIN_NAME=VeranaTestnet1
NEXT_PUBLIC_VERANA_RPC_ENDPOINT=https://rpc.testnet.verana.network
NEXT_PUBLIC_VERANA_REST_ENDPOINT=https://api.testnet.verana.network
NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_DEPOSIT=https://api.testnet.verana.network/verana/td/v1
NEXT_PUBLIC_VERANA_REST_ENDPOINT_DID=https://api.testnet.verana.network/verana/dd/v1
NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_REGISTRY=https://api.testnet.verana.network/verana/tr/v1
NEXT_PUBLIC_VERANA_REST_ENDPOINT_CREDENTIAL_SCHEMA=https://api.testnet.verana.network/verana/cs/v1
```

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/verana-labs/verana-frontend.git
cd verana-frontend
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file (loaded automatically by Next.js) in the root directory. The repository already includes a checked-in `.env` with default values, and an `.env-local` example if you prefer to keep a separate template. Copy whichever suits your workflow into `.env.local` and then customize it:

```bash
cp .env .env.local        # or: cp .env-local .env.local
# Edit .env.local with your configuration (git ignores this file)
```

### 4. Run Development Server

Start the development server with hot-reloading:

```bash
yarn dev
```

The application will be available at `http://localhost:3000` (or any port you supply via `PORT`/`--port`). If your UI needs to know the port (for example, to build a base URL), also set `NEXT_PUBLIC_PORT=3003` in your `.env`.

To bind the dev server to a different port:

```bash
PORT=3003 yarn dev
# or
yarn dev --port 3003
```

> **Tip:** The development server uses Turbopack for faster builds and hot module replacement.

---

## Production Deployment

### Method 1: Manual Deployment

#### 1. Build the Application

```bash
yarn install
yarn build
```

#### 2. Start the Production Server

```bash
yarn start
```

The application will run on the port specified by `PORT` (default: 3000). Set it with `PORT=4000 yarn start` or via your process manager. Remember to keep `NEXT_PUBLIC_PORT` aligned if the UI makes assumptions about the exposed port.

### Method 2: Docker Deployment

#### Using Docker Compose (Recommended)

The repository includes several Docker Compose configurations:

##### Option A: Build from Source

```bash
cd docker-compose/docker-dev
docker-compose up -d
```

This builds the image from the local source code and uses environment variables defined in the `docker-compose.yaml` file.

##### Option B: Use Pre-built Image

```bash
cd docker-compose/docker-hub
docker-compose up -d
```

This compose file references the pre-built image on Docker Hub (`veranalabs/verana-front:main`). Because the file also includes a `build` section, Docker Compose will rebuild the image by default; remove the `build` block if you want to pull only the published image.

##### Option C: Custom Environment Variables

If you need to use your own environment variables:

1. Copy the appropriate docker-compose file:
   ```bash
   cp docker-compose/docker-hub-no-environment/docker-compose.yaml docker-compose.yaml
   ```

2. Edit the environment variables in `docker-compose.yaml`

3. Run the container:
   ```bash
   docker-compose up -d
   ```

#### Using Docker Directly

##### 1. Build the Docker Image

```bash
docker build -t verana-frontend:latest .
```

##### 2. Run the Container

Set `PORT` if the server should listen on something other than `3000` (the default). Example:

```bash
docker run -d \
  -p 4000:3000 \
  -e NEXT_PUBLIC_PORT=3000 \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:4000 \
  -e NEXT_PUBLIC_VERANA_CHAIN_ID=vna-devnet-1 \
  -e NEXT_PUBLIC_VERANA_CHAIN_NAME=VeranaDevnet1 \
  -e NEXT_PUBLIC_VERANA_RPC_ENDPOINT=http://node1.devnet.verana.network:26657 \
  -e NEXT_PUBLIC_VERANA_REST_ENDPOINT=http://node1.devnet.verana.network:1317 \
  -e NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_DEPOSIT=http://node1.devnet.verana.network:1317/verana/td/v1 \
  -e NEXT_PUBLIC_VERANA_REST_ENDPOINT_DID=http://node1.devnet.verana.network:1317/verana/dd/v1 \
  -e NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_REGISTRY=http://node1.devnet.verana.network:1317/verana/tr/v1 \
  -e NEXT_PUBLIC_VERANA_REST_ENDPOINT_CREDENTIAL_SCHEMA=http://node1.devnet.verana.network:1317/verana/cs/v1 \
  --name verana-frontend \
  verana-frontend:latest
```

The `-p <host>:<container>` flag exposes the container's listener (default `PORT=3000`) on your machine. In the example above, requests to `http://localhost:4000` get forwarded to the container's port 3000. To change both the host port and the internal listener, set both sides, for example: `-p 4100:4000 -e PORT=4000`.

### Method 3: Kubernetes Deployment

#### 1. Prepare the Deployment File

The repository includes a Kubernetes deployment template at `kubernetes/verana-frontend-deployment.yaml`. You'll need to replace the environment variable placeholders:

```bash
# Set your environment variables
export DEPLOYMENT_NAME=verana-frontend
export IMAGE_NAME=verana-front
export IMAGE_TAG=main
export CLUSTER_NODE=your-node-name
export NEXT_PUBLIC_PORT=3000
export NEXT_PUBLIC_BASE_URL=https://your-domain.com
export NEXT_PUBLIC_VERANA_CHAIN_ID=vna-testnet-1
export NEXT_PUBLIC_VERANA_CHAIN_NAME=VeranaTestnet1
export NEXT_PUBLIC_VERANA_RPC_ENDPOINT=https://rpc.testnet.verana.network
export NEXT_PUBLIC_VERANA_REST_ENDPOINT=https://api.testnet.verana.network
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_DEPOSIT=https://api.testnet.verana.network/verana/td/v1
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_DID=https://api.testnet.verana.network/verana/dd/v1
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_REGISTRY=https://api.testnet.verana.network/verana/tr/v1
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_CREDENTIAL_SCHEMA=https://api.testnet.verana.network/verana/cs/v1
export KUBE_NAMESPACE=$NEXT_PUBLIC_VERANA_CHAIN_ID   # or set your own namespace
# ... set other environment variables
```

> The provided manifest only wires `NEXT_PUBLIC_*` variables. If you need to override server-side values such as `PORT`, add them to the `env` array in `kubernetes/verana-frontend-deployment.yaml` before applying.

> **Custom infrastructure:** The example above uses the public Verana RPC/REST endpoints for convenience. If you run your own validators, API nodes, or related services, point the `NEXT_PUBLIC_VERANA_*` variables to your infrastructure instead so the frontend talks to your cluster.
> **Node placement:** `CLUSTER_NODE` feeds the `nodeSelector` in the manifest. Replace `your-node-name` with an actual node label (e.g. the hostname label you get from `kubectl get nodes --show-labels`), otherwise Kubernetes will reject the manifest.

#### 2. Render the Manifest

All placeholders in `kubernetes/verana-frontend-deployment.yaml` must be substituted before applying. Use `envsubst` (or your templating tool of choice) after exporting the variables above:

```bash
envsubst < kubernetes/verana-frontend-deployment.yaml > verana-frontend-deployment.rendered.yaml
```

> **Namespaces:** pick the namespace you want to deploy into (for example, reuse `NEXT_PUBLIC_VERANA_CHAIN_ID`). If you exported `KUBE_NAMESPACE`, run `kubectl create namespace $KUBE_NAMESPACE` the first time to ensure it exists.

#### 3. Apply the Deployment

```bash
kubectl apply -f verana-frontend-deployment.rendered.yaml -n $KUBE_NAMESPACE
```

#### 4. Verify Deployment

```bash
kubectl get deployments -n $KUBE_NAMESPACE
kubectl get pods -n $KUBE_NAMESPACE
kubectl logs -f deployment/verana-frontend -n $KUBE_NAMESPACE
```

#### 5. Expose the Service

Create a service to expose the deployment:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: verana-frontend-service
spec:
  selector:
    app: verana-frontend-app
      ports:
        - protocol: TCP
          port: 80
          targetPort: 3000
      type: LoadBalancer
```

`targetPort: 3000` sends traffic to the container's listener, which defaults to the `PORT` value discussed earlier (3000 unless overridden). If you change the server's internal port, update both the container `ports` entry in the deployment and this `targetPort` to match. Save the service definition as `verana-frontend-service.yaml`, then apply it in the same namespace:

```bash
kubectl apply -f verana-frontend-service.yaml -n $KUBE_NAMESPACE
```

---

## Configuration Reference

### Docker Compose Files

The repository includes multiple Docker Compose configurations:

- **`docker-compose/docker-dev/`**: Development setup with build from source
- **`docker-compose/docker-dev-no-environment/`**: Development setup without predefined environment variables
- **`docker-compose/docker-hub/`**: Production setup using pre-built image
- **`docker-compose/docker-hub-no-environment/`**: Production setup without predefined environment variables

### Port Configuration

By default, the application runs on port 3000. Change the listening port by setting the `PORT` environment variable or by passing `--port` to `next dev`/`next start`. In Docker/Kubernetes we usually keep the internal port at 3000 and map/expose it externally; `NEXT_PUBLIC_PORT` only controls what the frontend bundle thinks the port is.

```yaml
ports:
  - 8080:3000  # Host port:Container port
```

### Network Configuration

The Docker Compose files include a `verana` network. If you're deploying multiple Verana components, ensure they're on the same network for inter-service communication.

---

## Troubleshooting

### Build Errors

**Issue**: Build fails with dependency errors

**Solution**: Clear the cache and reinstall dependencies:

```bash
rm -rf node_modules yarn.lock
yarn install
```

### Port Already in Use

**Issue**: Port 3000 is already in use

**Solution**: Change the port by setting `PORT` (or by passing `--port`):

```bash
PORT=3001 yarn dev
```

### Environment Variables Not Loading

**Issue**: Environment variables are not being picked up

**Solution**: 
- Ensure variables are prefixed with `NEXT_PUBLIC_`
- Restart the development server after changing `.env` file
- For production builds, environment variables are baked in at build time

### Docker Build Fails

**Issue**: Docker build fails with permission errors

**Solution**: Ensure Docker has proper permissions and try:

```bash
docker system prune -a
docker build --no-cache -t verana-frontend:latest .
```

### Connection to Chain Fails

**Issue**: Cannot connect to Verana chain endpoints

**Solution**:
- Verify network connectivity to the RPC and REST endpoints
- Check that the endpoints are correct for your network (devnet/testnet/mainnet)
- Ensure CORS is properly configured if accessing from a different domain

### Kubernetes Pods Crash

**Issue**: Pods crash or fail to start

**Solution**:
- Check pod logs: `kubectl logs <pod-name>`
- Verify all environment variables are set correctly
- Ensure the image exists and is accessible: `kubectl describe pod <pod-name>`
- Check resource limits and requests

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Verana Network Documentation](../network/welcome.md)
