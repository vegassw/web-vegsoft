#!/bin/bash

# =====================================================
# Vegsoft Solutions - Google Cloud Run Deployment Script
# =====================================================

# CONFIGURACIÓN - EDITA ESTOS VALORES
PROJECT_ID="TU_PROJECT_ID"          # Ej: vegsoft-123456
REGION="us-central1"                  # Región de Cloud Run
SERVICE_NAME="vegsoft-solutions"      # Nombre del servicio
BACKEND_URL="https://vegsoft-solutions-XXXXX-uc.a.run.app"  # Se actualiza después del primer deploy

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Vegsoft Solutions - Deploy to GCP    ${NC}"
echo -e "${GREEN}========================================${NC}"

# Verificar que gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI no está instalado${NC}"
    echo "Instálalo desde: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Login y configurar proyecto
echo -e "${YELLOW}Configurando proyecto...${NC}"
gcloud config set project $PROJECT_ID

# Habilitar APIs necesarias
echo -e "${YELLOW}Habilitando APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Build y deploy
echo -e "${YELLOW}Construyendo y desplegando...${NC}"
gcloud run deploy $SERVICE_NAME \
    --source . \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "MONGO_URL=mongodb+srv://USER:PASS@cluster.mongodb.net/vegsoft" \
    --set-env-vars "DB_NAME=vegsoft" \
    --set-env-vars "GOOGLE_CLIENT_ID=307650209341-kvouf5s47s16po759u0d70sc5lntmcee.apps.googleusercontent.com" \
    --set-env-vars "GOOGLE_CLIENT_SECRET=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" \
    --build-arg "REACT_APP_BACKEND_URL=$BACKEND_URL"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ¡Despliegue completado!              ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Tu aplicación está disponible en la URL mostrada arriba."
echo ""
echo -e "${YELLOW}IMPORTANTE: Después del primer deploy:${NC}"
echo "1. Copia la URL del servicio (https://vegsoft-solutions-XXXXX-uc.a.run.app)"
echo "2. Actualiza BACKEND_URL en este script"
echo "3. Actualiza las URLs en Google Cloud Console → Credenciales OAuth"
echo "4. Vuelve a ejecutar el deploy"
