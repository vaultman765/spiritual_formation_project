FROM python:3.12-slim
ENV PIPENV_VENV_IN_PROJECT=1
# Set backend working directory
WORKDIR /app/website

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev --no-install-recommends

# Install pipenv
RUN pip install --upgrade pip && pip install pipenv

# Copy Pipfile and Pipfile.lock from project root to /app/
COPY ../Pipfile ../Pipfile.lock /app/

# Install Python dependencies from /app
WORKDIR /app
RUN pipenv install --deploy --ignore-pipfile
# Copy backend code to /app/website
WORKDIR /app/website
COPY . /app/website

# Make sure venv is in PATH

ENV PATH="/app/.venv/bin:$PATH"

# Create staticfiles dir, add non-root user
RUN mkdir -p /app/website/staticfiles
RUN adduser --disabled-password --no-create-home django

EXPOSE 8000

# Entrypoint: collect static, migrate DB, start app
CMD ["sh", "-c", \
". /app/.venv/bin/activate && \
 python manage.py collectstatic --noinput && \
 python manage.py migrate --noinput && \
#  python manage.py import_arc --arc-id all --skip-unchanged && \
 gunicorn config.wsgi:application --bind 0.0.0.0:8000"]