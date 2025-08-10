FROM python:3.12-slim
ENV PIPENV_VENV_IN_PROJECT=1
ENV HOME=/home/app
# Set backend working directory
WORKDIR /app/website

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install pipenv
RUN pip install --upgrade pip && pip install pipenv

# Copy Pipfile and Pipfile.lock from project root to /app/
COPY ../Pipfile ../Pipfile.lock /app/


# Install Python dependencies from /app
WORKDIR /app
RUN pipenv install --deploy --ignore-pipfile && \
    apt-get update && \
    apt-get install -y curl unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" && \
    unzip /tmp/awscliv2.zip -d /tmp && \
    /tmp/aws/install && \
    rm -rf /tmp/aws /tmp/awscliv2.zip

# Copy backend code to /app/website
COPY . /app/
RUN chmod +x /app/scripts/run_import_job.sh

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
CMD ["sh", "-c", \
". /app/.venv/bin/activate && \
 python manage.py collectstatic --noinput && \
 python manage.py migrate --noinput && \
#  python manage.py import_arc --arc-id all --skip-unchanged && \
 gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3"]