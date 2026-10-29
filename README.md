# Northstar Banking - Full-Stack Microservices Application

A modern full-stack enterprise banking application built with **Spring Boot Microservices**, **React Vite Frontend**, **MySQL 8.0**, and orchestrated with **Docker**, **Kubernetes (Docker Desktop)**, and **Jenkins CI/CD**.

---

## 🏛 Architecture Overview

```
                                      +------------------------------------+
                                      |   React 19 Frontend (Vite+Nginx)   |
                                      |   Local: 5173 / K8s: NodePort 30173|
                                      +------------------+-----------------+
                                                         | (JWT in Auth Header)
                                                         v
                                      +------------------------------------+
                                      |       Spring Cloud Gateway         |
                                      |   Local: 8080 / K8s: NodePort 30080|
                                      +------------------+-----------------+
                                                         |
         +-----------------------------------------------+-----------------------------------+
         |                                               |                                   |
         v                                               v                                   v
+------------------+                           +------------------+                 +------------------+
|   Auth Service   |                           | Customer Service |                 | Account Service  |
|    Port: 8083    |                           |    Port: 8081    |                 |    Port: 8082    |
+--------+---------+                           +--------+---------+                 +--------+---------+
         |                                              |                                    |
         v                                              v                                    v
   MySQL: authdb                                 MySQL: customerdb                    MySQL: accountdb
         ^                                              ^                                    ^
         +----------------------------------------------+------------------------------------+
                                                        |
                                              +-------------------+
                                              |   Eureka Server   |
                                              |    Port: 8761     |
                                              +-------------------+
```

---

## 📦 Services and Ports

| Service | Port (Container) | Kubernetes NodePort | Purpose | Database |
|---|---|---|---|---|
| **eureka-server** | `8761` | - (ClusterIP) | Service Discovery & Registry | None |
| **api-gateway** | `8080` | `30080` | Reverse Proxy, JWT Validation, Routing, CORS | None |
| **auth-service** | `8083` | - (ClusterIP) | User Registration, BCrypt Auth, JWT Token Issue, `/me` | `authdb` |
| **customer-service**| `8081` | - (ClusterIP) | Customer CRUD, Validation, Pagination, OpenAPI | `customerdb` |
| **account-service** | `8082` | - (ClusterIP) | Account CRUD, Deposit/Withdraw Transactions | `accountdb` |
| **frontend** | `80` (Nginx) | `30173` | React 19 Single Page App (Vite, Tailwind, Router v7) | N/A |
| **mysql** | `3306` | - (ClusterIP) | Persistent MySQL 8 Database with separate schemas | All 3 DBs |

---

## 🚀 Running the Project

### Prerequisites
- Java 17+ (or Java 21 / 25)
- Maven 3.9+
- Node.js 18+ and npm
- Docker Desktop with Kubernetes enabled

---

### Option 1: Docker Compose (All-in-One)

1. Build backend and frontend artifacts:
   ```bash
   mvn clean package -DskipTests
   cd frontend && npm install && npm run build && cd ..
   ```

2. Launch all services:
   ```bash
   docker compose up --build -d
   ```

3. Open in Browser:
   - Frontend: `http://localhost:5173`
   - API Gateway: `http://localhost:8080`
   - Eureka Dashboard: `http://localhost:8761`

---

### Option 2: Kubernetes Deployment (Docker Desktop)

1. Ensure Kubernetes context is set to Docker Desktop:
   ```bash
   kubectl config use-context docker-desktop
   ```

2. Apply all manifests in order:
   ```bash
   kubectl apply -f k8s/
   ```

3. Verify pods:
   ```bash
   kubectl get pods -w
   ```

4. Access Application:
   - **Frontend App**: [http://localhost:30173](http://localhost:30173)
   - **API Gateway**: [http://localhost:30080](http://localhost:30080)
   - **Swagger / OpenAPI**:
     - Customer Service: [http://localhost:30080/swagger-ui/index.html](http://localhost:30080/swagger-ui/index.html)
     - Account Service: [http://localhost:30080/swagger-ui/index.html](http://localhost:30080/swagger-ui/index.html)

---

## 🛠 Kubernetes Manifest Structure (`k8s/`)

- `00-configmap-secret.yaml`: Central ConfigMap and Secret for DB credentials and JWT key.
- `01-mysql.yaml`: PersistentVolumeClaim (`mysql-pvc`), init SQL ConfigMap, MySQL Deployment & Service.
- `02-eureka-server.yaml`: Eureka Discovery Server Deployment & ClusterIP Service.
- `03-auth-service.yaml`: Auth microservice Deployment & ClusterIP Service.
- `04-customer-service.yaml`: Customer microservice Deployment & ClusterIP Service.
- `05-account-service.yaml`: Account microservice Deployment & ClusterIP Service.
- `06-api-gateway.yaml`: Spring Cloud Gateway Deployment & NodePort Service (`30080`).
- `07-frontend.yaml`: React Frontend Deployment & NodePort Service (`30173`).

---

## 🔄 Jenkins CI/CD Pipeline

A production-ready declarative pipeline is defined in `Jenkinsfile`:
1. **Checkout**: Clones repository from version control.
2. **Maven Build**: Cleans and packages all Spring Boot microservices into executable JARs.
3. **Frontend Build**: Builds Vite React production bundle (`dist/`).
4. **Docker Build**: Builds local Docker images for all services and frontend.
5. **Deploy to Kubernetes**: Applies `k8s/` manifests using context `docker-desktop`.
6. **Rollout Verification**: Waits for all deployments to successfully roll out.

---

## 🔑 Default Credentials
- **Admin**: `admin` / `admin123`
- **User Registration**: Available on the register page (`/register`) or `POST /api/auth/register`.
