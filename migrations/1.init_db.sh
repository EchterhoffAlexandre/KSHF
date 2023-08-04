# donner les droits d'exécution du fichier :
# chmod +x init_db.sh 


# Je prends l'identité de admin_kshf :
export PGUSER=admin_kshf

# Je supprime la BDD kshf
dropdb kshf
echo "BDD supprimée"

# Je crèe la BDD kshf
createdb kshf -O admin_kshf
echo "BDD créée"

# Je supprime sqitch.conf et sqitch.plan
rm sqitch.conf
rm sqitch.plan

# J'initiase Sqitch
sqitch init kshf --target db:pg:kshf
echo "Sqitch initialisé"