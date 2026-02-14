run_prod:
	docker compose up --build -d

run_dev:
	docker compose -f docker-compose-dev.yml up --build -d

update_dev:
		git pull
		npm run build
		docker restart app_dev

update_prod:
		git pull
		npm run build
		docker restart app_prod


logs_dev:
	docker logs --follow app_dev

logs_prod:
	docker logs --follow app_prod