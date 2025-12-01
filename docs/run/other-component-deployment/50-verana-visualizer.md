# Verana Visualizer

This guide provides comprehensive instructions for deploying the Verana Visualizer application. The Verana Visualizer is a modern, interactive Next.js frontend for exploring the Verana decentralized trust layer, including Trust Registries, Credential Schemas, DIDs, and network analytics with real historical blockchain data.

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

Before deploying the Verana Visualizer, ensure you have the following:

- **Node.js**: Version 18 or higher (Node 20 recommended)
- **Package Manager**: npm (comes with Node.js)
- **Docker**: Version 20.10 or higher (for containerized deployment)
- **Kubernetes**: Version 1.24 or higher (for Kubernetes deployment)
- **Helm**: Version 3.0 or higher (optional, for Helm chart deployment)
- **Access**: Network access to Verana chain RPC, REST, Indexer, and Resolver endpoints

---

## Environment Configuration

The Verana Visualizer requires several environment variables to connect to the Verana blockchain network and display network data. All variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Full URL where the application will be hosted | `https://vis.testnet.verana.network` |
| `NEXT_PUBLIC_API_ENDPOINT` | REST API endpoint URL | `https://api.testnet.verana.network` |
| `NEXT_PUBLIC_RPC_ENDPOINT` | RPC endpoint URL | `https://rpc.testnet.verana.network` |
| `NEXT_PUBLIC_IDX_ENDPOINT` | Indexer endpoint URL | `https://idx.testnet.verana.network` |
| `NEXT_PUBLIC_RESOLVER_ENDPOINT` | DID Resolver endpoint URL | `https://resolver.testnet.verana.network` |
| `NEXT_PUBLIC_CHAIN_ID` | Verana chain identifier | `vna-testnet-1` |
| `NEXT_PUBLIC_CHAIN_NAME` | Human-readable chain name | `Testnet` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Verana Visualizer` |
| `NEXT_PUBLIC_APP_LOGO` | Logo filename (must exist in `public/` directory) | `logo.svg` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GITHUB_TOKEN` | GitHub API token for Developer Activity page | Not set (60 requests/hour limit) |
| `NEXT_PUBLIC_PORT` | Port displayed/consumed by the frontend bundle | `3000` |

> **Note:** Without a GitHub token, the Developer Activity page is limited to 60 requests per hour. With a token (requires `public_repo` scope), you get 5,000 requests per hour. Create a token at [GitHub Settings](https://github.com/settings/tokens).

### Server Runtime Variables

These variables are only read by the Next.js server process. They are **not** exposed to the browser bundle, so they do not use the `NEXT_PUBLIC_` prefix.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port used by `next dev`/`next start` | `3000` |

> Use `PORT` (or `next dev --port <value>`) to change the port the Node.js server binds to. `NEXT_PUBLIC_PORT` is still useful for generating links or displaying the port inside the UI, but it does not affect the server listener.

### Alternative Verana-Specific Variables

For compatibility with other Verana components, you can also use these variables (mapped in Kubernetes deployments):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_VERANA_CHAIN_ID` | Verana chain identifier |
| `NEXT_PUBLIC_VERANA_CHAIN_NAME` | Human-readable chain name |
| `NEXT_PUBLIC_VERANA_RPC_ENDPOINT` | RPC endpoint URL |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT` | REST API endpoint URL |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_DEPOSIT` | Trust Deposit REST endpoint |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_DID` | DID REST endpoint |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_REGISTRY` | Trust Registry REST endpoint |
| `NEXT_PUBLIC_VERANA_REST_ENDPOINT_CREDENTIAL_SCHEMA` | Credential Schema REST endpoint |

### Environment Examples

#### Testnet Configuration

```bash
NEXT_PUBLIC_BASE_URL=https://vis.testnet.verana.network
NEXT_PUBLIC_API_ENDPOINT=https://api.testnet.verana.network
NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.testnet.verana.network
NEXT_PUBLIC_IDX_ENDPOINT=https://idx.testnet.verana.network
NEXT_PUBLIC_RESOLVER_ENDPOINT=https://resolver.testnet.verana.network
NEXT_PUBLIC_CHAIN_ID=vna-testnet-1
NEXT_PUBLIC_CHAIN_NAME=Testnet
NEXT_PUBLIC_APP_NAME=Verana Visualizer
NEXT_PUBLIC_APP_LOGO=logo.svg
```

#### Devnet Configuration

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_ENDPOINT=http://node1.devnet.verana.network:1317
NEXT_PUBLIC_RPC_ENDPOINT=http://node1.devnet.verana.network:26657
NEXT_PUBLIC_IDX_ENDPOINT=http://node1.devnet.verana.network:8080
NEXT_PUBLIC_RESOLVER_ENDPOINT=http://node1.devnet.verana.network:8081
NEXT_PUBLIC_CHAIN_ID=vna-devnet-1
NEXT_PUBLIC_CHAIN_NAME=Devnet
NEXT_PUBLIC_APP_NAME=Verana Visualizer
NEXT_PUBLIC_APP_LOGO=logo.svg
```

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/verana-labs/verana-visualizer.git
cd verana-visualizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file (loaded automatically by Next.js) in the root directory. The repository includes an `env.example` file with default values. Copy it to `.env.local` and customize it:

```bash
cp env.example .env.local
# Edit .env.local with your configuration (git ignores this file)
```

### 4. Run Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or any port you supply via `PORT`/`--port`). If your UI needs to know the port (for example, to build a base URL), also set `NEXT_PUBLIC_PORT=3003` in your `.env.local`.

To bind the dev server to a different port:

```bash
PORT=3003 npm run dev
# or
npm run dev --port 3003
```

> **Tip:** The development server supports hot module replacement, so changes to your code will be reflected immediately in the browser.

### 5. Run Tests (Optional)

```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

---

## Production Deployment

### Method 1: Manual Deployment

#### 1. Build the Application

```bash
npm install
npm run build
```

#### 2. Start the Production Server

```bash
npm start
```

The application will run on the port specified by `PORT` (default: 3000). Set it with `PORT=4000 npm start` or via your process manager. Remember to keep `NEXT_PUBLIC_PORT` aligned if the UI makes assumptions about the exposed port.

### Method 2: Docker Deployment

#### Build the Docker Image

```bash
docker build -t verana/verana-visualizer:latest .
```

#### Run the Container

Set `PORT` if the server should listen on something other than `3000` (the default). Example:

```bash
docker run --rm -p 4000:3000 \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:4000 \
  -e NEXT_PUBLIC_API_ENDPOINT=https://api.testnet.verana.network \
  -e NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.testnet.verana.network \
  -e NEXT_PUBLIC_IDX_ENDPOINT=https://idx.testnet.verana.network \
  -e NEXT_PUBLIC_RESOLVER_ENDPOINT=https://resolver.testnet.verana.network \
  -e NEXT_PUBLIC_CHAIN_ID=vna-testnet-1 \
  -e NEXT_PUBLIC_CHAIN_NAME=Testnet \
  -e NEXT_PUBLIC_APP_NAME="Verana Visualizer" \
  -e NEXT_PUBLIC_APP_LOGO=logo.svg \
  verana/verana-visualizer:latest
```

The `-p <host>:<container>` flag exposes the container's listener (default `PORT=3000`) on your machine. In the example above, requests to `http://localhost:4000` get forwarded to the container's port 3000. To change both the host port and the internal listener, set both sides, for example: `-p 4100:4000 -e PORT=4000`.

> **Note:** The Dockerfile uses a multi-stage build with Next.js standalone output for optimal image size and performance. Environment variables are baked into the build at build time, so you'll need to rebuild the image if you change `NEXT_PUBLIC_*` variables.

### Method 3: Kubernetes Deployment

#### Option A: Direct Manifest Deployment

The repository includes a Kubernetes deployment manifest at `k8s/deployment.yaml`:

```bash
kubectl apply -f k8s/deployment.yaml
```

This creates:
- A `Deployment` with 3 replicas
- A `Service` of type `LoadBalancer`
- Health probes (liveness and readiness)
- Resource requests and limits

#### Option B: Template-Based Deployment

For more control, use the template at `kubernetes/verana-visualizer-deployment.yaml`:

1. Set your environment variables:

```bash
export DEPLOYMENT_NAME=verana-visualizer
export IMAGE_NAME=verana-visualizer
export IMAGE_TAG=latest
export DH_USERNAME=verana
export CLUSTER_NODE=your-node-name
export ENV=testnet
export NEXT_PUBLIC_PORT=3000
export NEXT_PUBLIC_BASE_URL=https://vis.testnet.verana.network
export NEXT_PUBLIC_VERANA_CHAIN_ID=vna-testnet-1
export NEXT_PUBLIC_VERANA_CHAIN_NAME=VeranaTestnet1
export NEXT_PUBLIC_VERANA_RPC_ENDPOINT=https://rpc.testnet.verana.network
export NEXT_PUBLIC_VERANA_REST_ENDPOINT=https://api.testnet.verana.network
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_DEPOSIT=https://api.testnet.verana.network/verana/td/v1
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_DID=https://api.testnet.verana.network/verana/dd/v1
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_TRUST_REGISTRY=https://api.testnet.verana.network/verana/tr/v1
export NEXT_PUBLIC_VERANA_REST_ENDPOINT_CREDENTIAL_SCHEMA=https://api.testnet.verana.network/verana/cs/v1
export NEXT_PUBLIC_VERANA_SIGN_DIRECT_MODE=false
export NEXT_PUBLIC_SESSION_LIFETIME_SECONDS=86400
```

2. Apply the deployment:

```bash
kubectl apply -f kubernetes/verana-visualizer-deployment.yaml
```

This template includes:
- Deployment with configurable replicas
- Service (ClusterIP)
- Ingress with TLS (cert-manager integration)
- Health probes
- Resource limits

3. Verify Deployment

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress
kubectl logs -f deployment/verana-visualizer
```

> **Note:** The template manifest includes a Service and Ingress. The Service `targetPort: 3000` sends traffic to the container's listener, which defaults to the `PORT` value (3000 unless overridden). If you change the server's internal port, update both the container `ports` entry in the deployment and the Service `targetPort` to match.

### Method 4: Helm Chart Deployment

The repository includes a production-ready Helm chart at `helm/verana-visualizer/`.

#### Install the Chart

```bash
helm install verana-visualizer ./helm/verana-visualizer \
  --set image.repository=verana/verana-visualizer \
  --set image.tag=latest
```

#### Customize Configuration

Override values via `--set` flags or a custom `values.yaml`:

```bash
helm upgrade --install verana-visualizer ./helm/verana-visualizer \
  --set replicaCount=5 \
  --set env.NEXT_PUBLIC_CHAIN_NAME=Mainnet \
  --set env.NEXT_PUBLIC_CHAIN_ID=vna-mainnet-1 \
  --set env.NEXT_PUBLIC_BASE_URL=https://vis.mainnet.verana.network
```

#### Common Helm Overrides

- `replicaCount`: Number of pod replicas (default: 3)
- `service.type`: Service type - `LoadBalancer`, `ClusterIP`, or `NodePort` (default: `LoadBalancer`)
- `ingress.enabled`: Enable Ingress resource (default: `true`)
- `ingress.hosts[0].host`: Ingress hostname
- `resources.requests/limits`: CPU and memory resources
- `env.*`: Environment variables

#### View Chart Values

```bash
helm show values ./helm/verana-visualizer
```

---

## Configuration Reference

### Application Features

The Verana Visualizer includes the following features:

- **Dashboard**: At-a-glance network metrics and statistics
- **Interactive Analytics Charts**: Real historical blockchain data over 30 days
  - Token supply trends (area chart)
  - Inflation rate history (line chart)
  - Validator distribution (bar chart)
  - Staking distribution (pie chart)
  - Network activity metrics (composed chart)
- **Network Graph**: Interactive 3D visualization of network relationships
- **Trust Registries**: Search and explore trust registries with rich details
- **DID Directory**: Browse decentralized identifiers
- **Developer Activity**: GitHub repository statistics (requires GitHub token)

> **Note on Charts**: The analytics charts fetch historical data by querying blockchain state at 30 different block heights over the past 30 days. Initial load takes 10-30 seconds as it retrieves real on-chain data. All displayed metrics represent actual network state.

### Port Configuration

By default, the application runs on port 3000. Change the listening port by setting the `PORT` environment variable or by passing `--port` to `next dev`/`next start`. In Docker/Kubernetes we usually keep the internal port at 3000 and map/expose it externally; `NEXT_PUBLIC_PORT` only controls what the frontend bundle thinks the port is.

```bash
export PORT=8080
npm start
```

For Docker, map the container port to your desired host port:

```bash
docker run -p 8080:3000 verana/verana-visualizer:latest
```

```yaml
ports:
  - 8080:3000  # Host port:Container port
```

### Logo Configuration

The logo file specified in `NEXT_PUBLIC_APP_LOGO` must exist in the `public/` directory. Supported formats include SVG, PNG, and JPEG. The default is `logo.svg`.

### GitHub Token Configuration

To enable full functionality of the Developer Activity page:

1. Create a GitHub Personal Access Token at [GitHub Settings](https://github.com/settings/tokens)
2. Grant the `public_repo` scope
3. Set the token as an environment variable:

```bash
export NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_token_here
```

> **Security Note:** Never commit GitHub tokens to version control. Use environment variables or secrets management systems.

---

## Troubleshooting

### Build Errors

**Issue**: Build fails with dependency errors

**Solution**: Clear the cache and reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build fails with TypeScript errors

**Solution**: Ensure you're using Node.js 18+ and check TypeScript version:

```bash
node --version  # Should be 18+
npm run build
```

### Port Already in Use

**Issue**: Port 3000 is already in use

**Solution**: Change the port by setting `PORT` (or by passing `--port`):

```bash
PORT=3001 npm run dev
```

Or for Docker:

```bash
docker run -p 3001:3000 verana/verana-visualizer:latest
```

### Environment Variables Not Loading

**Issue**: Environment variables are not being picked up

**Solution**: 
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- For local development, use `.env.local` file
- Restart the development server after changing environment variables
- For production builds, environment variables are baked in at build time

### Charts Not Loading

**Issue**: Analytics charts show loading state indefinitely

**Solution**:
- Verify network connectivity to RPC and REST endpoints
- Check browser console for CORS errors
- Ensure the RPC endpoint supports historical queries with `?height=X` parameter
- Initial chart load can take 10-30 seconds as it queries 30 different block heights

### Docker Build Fails

**Issue**: Docker build fails with permission errors

**Solution**: Ensure Docker has proper permissions and try:

```bash
docker system prune -a
docker build --no-cache -t verana/verana-visualizer:latest .
```

**Issue**: Docker build fails with "standalone output not found"

**Solution**: Ensure `next.config.js` has `output: 'standalone'` configured. Check the Next.js configuration file.

### Kubernetes Pods Crash

**Issue**: Pods crash or fail to start

**Solution**:
- Check pod logs: `kubectl logs <pod-name>`
- Verify all environment variables are set correctly
- Ensure the image exists and is accessible: `kubectl describe pod <pod-name>`
- Check resource limits and requests
- Verify health probe endpoints are correct

**Issue**: Ingress not working

**Solution**:
- Verify Ingress controller is installed: `kubectl get ingressclass`
- Check Ingress resource: `kubectl describe ingress <ingress-name>`
- Verify TLS certificate is issued: `kubectl get certificate`
- Check cert-manager is installed and configured

### Network Graph Not Displaying

**Issue**: 3D network graph is blank or not rendering

**Solution**:
- Check browser console for WebGL errors
- Verify your browser supports WebGL (most modern browsers do)
- Ensure the API endpoints are accessible and returning data
- Check that the `NEXT_PUBLIC_API_ENDPOINT` is correctly configured

### GitHub API Rate Limiting

**Issue**: Developer Activity page shows rate limit errors

**Solution**:
- Add a GitHub Personal Access Token with `public_repo` scope
- Set `NEXT_PUBLIC_GITHUB_TOKEN` environment variable
- Without a token, you're limited to 60 requests/hour
- With a token, you get 5,000 requests/hour

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Verana Network Documentation](../network/welcome.md)
- [Verana Visualizer Repository](https://github.com/verana-labs/verana-visualizer)
- [Verana Discord Community](https://discord.gg/edjaFn252q)
