#!/bin/bash

# ==============================================================================
# SPLASHBot Frontend Deployment Script
# ==============================================================================

GREEN='\033[0;32m'
NC='\033[0m'
RED='\033[0;31m'
YELLOW='\033[1;33m'

echo -e "${GREEN}=== Memulai Deploy Frontend SPLASHBot ===${NC}"

# Validasi Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker tidak ditemukan.${NC}"
    exit 1
fi

# Tentukan command docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo -e "${RED}Error: Docker Compose tidak ditemukan.${NC}"
    exit 1
fi

# Validasi file .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Peringatan: File .env.local tidak ditemukan! Harap siapkan sebelum menjalankan.${NC}"
fi

# Hentikan frontend lama
echo -e "${YELLOW}Menghentikan kontainer frontend yang lama...${NC}"
$DOCKER_COMPOSE down

# Build dan jalankan frontend
echo -e "${GREEN}Membangun dan menjalankan kontainer frontend...${NC}"
$DOCKER_COMPOSE up --build -d

echo -e "${GREEN}=== Frontend Deployment Selesai ===${NC}"
$DOCKER_COMPOSE ps
echo -e "Frontend berjalan secara lokal di port: ${YELLOW}3000${NC}"
