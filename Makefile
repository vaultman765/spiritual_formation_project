shell:
	pip install --upgrade pip && pip install pipenv && pipenv shell && pipenv sync

update:
	pip install --upgrade pip && pipenv install && pipenv sync

update-dev:
	pip install --upgrade pip && pipenv install && pipenv install --dev && pipenv sync

lint:
	pipenv run flake8 scripts/

runserver:
	pipenv run python manage.py runserver

npm-dev:
	cd frontend && npm run dev -- --host
