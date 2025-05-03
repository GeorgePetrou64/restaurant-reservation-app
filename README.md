Εφαρμογή Κράτησης Θέσεων σε Εστιατόριο

Αυτό το αποθετήριο περιέχει την πλήρη υλοποίηση μιας εφαρμογής κρατήσεων σε εστιατόριο:

Backend: Node.js + Express REST API με MariaDB

Mobile App: React Native (Expo) frontend για χρήστες και διαχειριστές


Περιεχόμενα
-----------
1.Προαπαιτούμενα

2.Δημιουργία Βάσης Δεδομένων

3.Εγκατάσταση

4.Εκτέλεση

5.API Endpoints

Προαπαιτούμενα
-------------

Node.js v14+ και npm ή yarn

MariaDB (ή MySQL)

Git

Expo Go (για κινητές συσκευές)

Δημιουργία Βάσης Δεδομένων
--------------------------
Μπορείτε να κάνετε import to αρχείο restaurant_dp στο phpmyadmin για την δημιουργεία της βάσεις δεδομένων.

Εγκατάσταση
-
1.Στην γραμμή εντολών ενός νέου φακέλου κάνετε clone to repository με git clone https://github.com/GeorgePetrou64/restaurant-reservation-app.git

2.Στο directory του backend τρέχετε

cd restaurant-reservation-backend

(echo PORT=5000)>.env

(echo DB_HOST=localhost)>>.env

(echo DB_USER=root)>>.env

(echo DB_PASSWORD=)>>.env

(echo DB_NAME=restaurant_db)>>.env

(echo JWT_SECRET=your_secret_key)>>.env

για την δημιουργία του .env

Το αρχείο .env πρέπει να έχει αυτήν την μορφή: 

PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=

DB_NAME=restaurant_db

JWT_SECRET=your_secret_key

3.Μέσα στο directory του backend τρέχετε npm install 

4.Μέσα στο directory του frontend τρέχετε npm install 

Εκτέλεση
--------
Στο directory του backend: node app.js

Στο directory του frontend: npx expo start

Σκανάρετε το QR code με το κινητό

API Endpoints
------------

Authentication

POST /api/users/register — Εγγραφή χρήστη

POST /api/users/login — Σύνδεση (επιστρέφει JWT)

Restaurants

GET /api/restaurants — Όλα τα εστιατόρια

GET /api/restaurants?q=<όρος> — Φιλτράρισμα με βάση όνομα ή τοποθεσία

Reservations (User)

GET /api/reservations/my — Κρατήσεις του συνδεδεμένου χρήστη

POST /api/reservations — Δημιουργία νέας κράτησης

PUT /api/reservations/:id — Επεξεργασία κράτησης

DELETE /api/reservations/:id — Ακύρωση κράτησης

Admin (admin role)

GET /api/admin/stats — Στατιστικά (users & reservations)

GET /api/admin/reservations — Όλες οι κρατήσεις

DELETE /api/admin/reservations/:id — Διαγραφή κράτησης

GET /api/admin/users — Λίστα χρηστών

PUT /api/admin/users/:id/role — Αλλαγή ρόλου

DELETE /api/admin/users/:id — Διαγραφή χρήστη
