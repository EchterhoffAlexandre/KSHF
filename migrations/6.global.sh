#!/bin/bash

bash ./1.init_db.sh
echo "1.init_db.sh"

bash ./2.add_version.sh
echo "2.add_version.sh"

bash ./3.deploy.sh
echo "3.deploy.sh"

bash ./5.seeding.sh
echo "5.seeding.sh"