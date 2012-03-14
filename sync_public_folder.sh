rsync -rcv --chmod=ug=rwX -e "ssh -i /appdata/id_rsa" ./public/ hhsweb@comment-ws-01:/var/www/voc/public/
