rsync -rcv --chmod=uog=rX -e "ssh -i /appdata/id_rsa" ./public/ hhsweb@comment-ws-01:/var/www/voc/public/
rsync -rcv --chmod=uog=rX -e "ssh -i /appdata/id_rsa-comment-ws-02" ./public/ hhsweb@comment-ws-02:/var/www/voc/public/