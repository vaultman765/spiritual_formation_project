FROM python:3.12-slim
ENV PIPENV_VENV_IN_PROJECT=1
ENV HOME=/home/app
ENV PATH="/app/.venv/bin:$PATH"
# Set backend working directory
WORKDIR /app

# Copy Pipfile and Pipfile.lock from project root to /app/
COPY Pipfile Pipfile.lock /app/

# Install system and Python dependencies from /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        libpq-dev \
        unzip \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip \
    && pip install pipenv \
    && pipenv install --deploy --ignore-pipfile \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" \
    && unzip /tmp/awscliv2.zip -d /tmp \
    && /tmp/aws/install \
    && rm -rf /tmp/aws /tmp/awscliv2.zip

# Copy backend code to /app/website
COPY __init__.py /app/
COPY manage.py /app/
COPY config/ /app/config/
COPY scripts/ /app/scripts/
COPY website/ /app/website/
RUN chmod +x /app/scripts/run_import_job.sh \
    && chmod +x /app/scripts/docker_entrypoint.sh

# Make sure venv is in PATH
ENV PATH="/app/.venv/bin:$PATH"

# Create staticfiles dir, add non-root user
RUN mkdir -p /app/staticfiles && \
    mkdir -p /app/website/data && \
    adduser --disabled-password --no-create-home django && \
    chown -R django:django /app/staticfiles /app/website/data

EXPOSE 8000

# Switch to django user (security best practice)
USER django

# Entrypoint: collect static, migrate DB, start app
CMD ["/app/scripts/docker_entrypoint.sh"]