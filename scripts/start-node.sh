# start local moonbeam node
docker run --rm --name moonbeam_development -p 9944:9944 -p 9933:9933 \
purestake/moonbeam:v0.13.2 \
--dev --ws-external --rpc-external
