rsync -rcv --chmod=uog=rX -e "ssh -i /appdata/id_rsa" ./public/ hhsweb@comment-ws-01:/var/www/voc/public/
