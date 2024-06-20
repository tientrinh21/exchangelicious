echo "Seeding the database..."
cat database_schemas/*.sql | mysql -u root -p'Iamcute21'
echo "Done"
