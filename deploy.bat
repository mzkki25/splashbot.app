@echo off
echo ==============================================================================
echo Memulai Deploy Frontend SPLASHBot (Windows)
echo ==============================================================================

:: Cek apakah Docker terpasang
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Docker tidak ditemukan. Harap instal Docker terlebih dahulu.
    pause
    exit /b 1
)

:: Tentukan command docker compose
docker compose version >nul 2>nul
if %errorlevel% equ 0 (
    set DOCKER_COMPOSE=docker compose
) else (
    where docker-compose >nul 2>nul
    if %errorlevel% equ 0 (
        set DOCKER_COMPOSE=docker-compose
    ) else (
        echo Error: Docker Compose tidak ditemukan. Harap instal Docker Compose.
        pause
        exit /b 1
    )
)

:: Cek file .env.local
if not exist .env.local (
    echo Peringatan: File .env.local tidak ditemukan! Harap siapkan sebelum menjalankan.
)

echo Membangun dan menjalankan kontainer frontend...
%DOCKER_COMPOSE% up --build -d

echo ==============================================================================
echo Frontend Deployment Selesai!
echo ==============================================================================
%DOCKER_COMPOSE% ps
echo Frontend berjalan secara lokal di port: 3000
