# Je prends l'identité admin_ocolis
export PGUSER=admin_kshf
export PGPASSWORD=kshf

# sqitch deploy
# sqitch deploy 1.create_tables_v2
# sqitch deploy 2.add_constraint_delete
# sqitch deploy 3.rework_transaction_table
# sqitch deploy 4.domain_index_check
sqitch deploy 5.create_tables_v3
