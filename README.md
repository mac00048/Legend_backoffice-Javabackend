
## Backup

```
pg_dump -h 127.0.0.1 -U postgres -c backoffice | gzip > /srv/backoffice/backup/backoffice_`date +"%Y%m%d%H%M%S"`.sql.gz
```

## Restore

```
cat /srv/backoffice/backup/backoffice_20191125174041.sql.gz | gunzip | psql -h 127.0.0.1 -U postgres backoffice
```

## Deploy

```
make build
make deploy
```

```
ssh rafael@backoffice.legendatours.com
sudo mv /home/rafael/backoffice-1.0-SNAPSHOT.jar /srv/backoffice/
sudo systemctl restart backoffice
```
