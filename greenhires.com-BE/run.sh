
## set up env
sudo apt install dos2unix
dos2unix .env
dos2unix .env.production

## open port 8955
sudo ufw status
sudo ufw enable
sudo ufw allow 8955/tcp
sudo ufw status


docker network create humantree_main
docker network rm humantree_main

docker compose -f docker-compose-prod.yml up -d --build

## ci/cd
git add .  ; git commit -m "test" ; git push 


docker logs -t 1481aa82a258
docker compose down -v 
docker compose down -v ; git pull; docker compose -f docker-compose-prod.yml up -d --build

## restore db
just restore backup-2024-08-03-043924.dump.gz 


