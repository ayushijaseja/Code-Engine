#!/bin/bash

echo "🛠️  Building Agent Image..."
docker build -t code-engine-agent -f agent.Dockerfile . 

echo "📦 Loading Image into Kind..."
kind load docker-image code-engine-agent:latest --name code-engine-cluster

echo "♻️  Restarting Pods..."
kubectl delete pods -l app.kubernetes.io/name=code-engine-agent 2>/dev/null || kubectl delete pods --all

echo "✅ Done! Wait 5 seconds and try the Frontend again."