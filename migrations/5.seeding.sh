# Je prends l'identité admin_ocolis
export PGUSER=admin_kshf
export PGPASSWORD=kshf
export PGDATABASE=kshf

# Je rempli la bdd
psql -f ../data/seeding_v2.sql
#psql -f ../data/seeding_v3.sql
echo "seed db kshf"
