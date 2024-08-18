import sqlite3

# Nome del file del database
db_filename = 'tickets.db'

# Connessione al database (crea il file se non esiste)
conn = sqlite3.connect(db_filename)
cursor = conn.cursor()

# Creazione della tabella
cursor.execute('''
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT CHECK(state IN ('Open', 'Closed')),
    category TEXT CHECK(category IN ('Inquiry', 'Maintenance', 'New feature', 'Administrative', 'Payment')),
    owner TEXT,
    title TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
)
''')

cursor.execute('''
CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL,
	name TEXT,
	hash TEXT NOT NULL,
	salt TEXT NOT NULL
)
''')

# Inserimento dei dati di esempio
tickets_data = [
    ('Open', 'Inquiry', 'Alice', 'Richiesta di supporto', '2024-08-12T10:00:00.111Z', 'Richiesta di informazioni sulla funzionalità del sistema.'),
    ('Closed', 'Maintenance', 'Bob', 'Manutenzione programmata', '2024-08-11T15:30:00.222Z', 'Manutenzione programmata del server.'),
    ('Open', 'New feature', 'Charlie', 'Nuova funzionalità richiesta', '2024-08-10T09:45:00.333Z', 'Richiesta per l\'aggiunta di una nuova funzionalità nel modulo di reportistica.'),
    ('Closed', 'Administrative', 'Alice', 'Aggiornamento delle politiche', '2024-08-09T14:20:00.444Z', 'Aggiornamento delle politiche aziendali per la gestione dei dati.'),
    ('Open', 'Payment', 'Bob', 'Problema con il pagamento', '2024-08-08T11:15:00.555Z', 'Problema riscontrato con il pagamento effettuato il 7 agosto.')
]

cursor.executemany('''
INSERT INTO tickets (state, category, owner, title, timestamp, description)
VALUES (?, ?, ?, ?, ?, ?)
''', tickets_data)

users_data = [
    (1,'u1@p.it','John','15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288','72e4eeb14def3b21'),
    (2,'u2@p.it','Alice','1d22239e62539d26ccdb1d114c0f27d8870f70d622f35de0ae2ad651840ee58a','a8b618c717683608'),
    (3,'u3@p.it','George','61ed132df8733b14ae5210457df8f95b987a7d4b8cdf3daf2b5541679e7a0622','e818f0647b4e1fe0')
]

cursor.executemany('''
INSERT INTO users (id, email, name, hash, salt)
VALUES (?, ?, ?, ?, ?)
''', users_data)

# Commit e chiusura della connessione
conn.commit()
conn.close()

print(f"Database '{db_filename}' creato con successo!")
