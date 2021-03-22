echo" stoping docker containers"
docker stop $(docker ps -aq)
sleep 6
echo" removing docker containers "
docker rm $(docker ps -aq)