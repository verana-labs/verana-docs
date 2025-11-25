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
| `NEXT_PUBLIC_PORT` | Port the application runs on | `3000` |
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
| `NEXT_PUBLIC_VERANA_SIGN_DIRECT_MODE` | Use direct signing mode | `false` |
| `NEXT_PUBLIC_SESSION_LIFETIME_SECONDS` | Session lifetime in seconds | `86400` (24 hours) |

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

Create a `.env` file in the root directory with your environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Development Server

Start the development server with hot-reloading:

```bash
yarn dev
```

The application will be available at `http://localhost:3000` (or the port specified in `NEXT_PUBLIC_PORT`).

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

The application will run on the port specified in `NEXT_PUBLIC_PORT` (default: 3000).

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

This uses the pre-built image from Docker Hub (`veranalabs/verana-front:main`).

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

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_PORT=3000 \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
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
# ... set other environment variables
```

#### 2. Apply the Deployment

```bash
kubectl apply -f kubernetes/verana-frontend-deployment.yaml
```

#### 3. Verify Deployment

```bash
kubectl get deployments
kubectl get pods
kubectl logs -f deployment/verana-frontend
```

#### 4. Expose the Service

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

Apply the service:

```bash
kubectl apply -f verana-frontend-service.yaml
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

By default, the application runs on port 3000. You can change this by setting the `NEXT_PUBLIC_PORT` environment variable. When using Docker, map the container port to your desired host port:

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

**Solution**: Change the port in your environment variables:

```bash
export NEXT_PUBLIC_PORT=3001
yarn dev
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