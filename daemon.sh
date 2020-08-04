#!/bin/sh

while true
do
    SONG=$(spotifycli --song)
    ARTIST=$(spotifycli --artist)
    ALBUM=$(spotifycli --album)

    ARTID=$(spotifycli --arturl | cut -d '/' -f5)
    ART=$(echo -n "http://i.scdn.co/image/$ARTID")

    echo -n '{"song":"' > /var/www/html/status.tmp
    echo -n $SONG >> /var/www/html/status.tmp
    echo -n '","artist":"' >> /var/www/html/status.tmp
    echo -n $ARTIST >> /var/www/html/status.tmp
    echo -n '","album":"' >> /var/www/html/status.tmp
    echo -n $ALBUM >> /var/www/html/status.tmp
    echo -n '","artwork":"' >> /var/www/html/status.tmp
    echo -n $ART >> /var/www/html/status.tmp
    echo -n '"}' >> /var/www/html/status.tmp

    mv /var/www/html/status.tmp /var/www/html/status

    sleep 2s
done



