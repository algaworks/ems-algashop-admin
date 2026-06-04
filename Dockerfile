# Dockerfile
FROM sonarsource/sonar-scanner-cli:latest

# Switch to root user to install packages
USER root

# Install jq and curl
RUN yum update && yum install -y jq

# Switch back to the default user
USER scanner-cli