# Fullstack Java Project

## Britt Strauven (3AONC)
## Folder structure

- Readme.md
- _architecture_: this folder contains documentation regarding the architecture of your system.
- `docker-compose.yml` : to start the backend
- _backend-java_: contains microservices written in java
- _demo-artifacts_: contains images, files, etc that are useful for demo purposes.
- _frontend-web_: contains the Angular webclient

Each folder contains its own specific `.gitignore` file.  
**:warning: complete these files asap, so you don't litter your repository with binary build artifacts!**

## How to setup and run this application
Run docker compose in root directory to start frontend databases and RabbitMq
Start microservices in backend manually
Start microservices in this order:
- config service: with run profile native
- discovery service
- gateway service
- messaging service
- comment service
- review service
- post service
