# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

user = User.create!(email: 'antonio@gamercentral.mx', first_name: 'Juan Antonio', last_name: 'Chavez Valencia', password: 'asdfasdf')
user.confirm
user.add_role :admin
