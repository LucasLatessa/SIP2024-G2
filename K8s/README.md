# Despliegue

1. Levantar todo con terraform

terraform init
terraform plan
terraform apply

2. Ahora kubernetes

kubectl get pods
kubectl get svc
kubect apply -f front-services.yaml
kubect apply -f back-services.yaml

kubect apply -f certificate.yaml

kubect apply -f front-ingress.yaml
kubect apply -f back-ingress.yaml