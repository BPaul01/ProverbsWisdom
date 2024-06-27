import sys
import psycopg2

try:
    connection = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="12345",
        port=5432
    )
except Exception as e:
    print("Error connecting to the database:", e, file=sys.stderr)

try:
    try:
        cursor = connection.cursor()
    except Exception as e:
        print("Error creating cursor:", e, file=sys.stderr)
        raise e
    
    # Drop existing tables if they exist
    cursor.execute('DROP TABLE IF EXISTS messages;')
    cursor.execute('DROP TABLE IF EXISTS conversation;')
    cursor.execute('DROP TABLE IF EXISTS app_user;')
    
    # Create new tables
    cursor.execute("""
        CREATE TABLE app_user (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255) NOT NULL
        );""")
    
    cursor.execute("""
        CREATE TABLE conversation (
            id SERIAL PRIMARY KEY,
            userId INTEGER NOT NULL,
            FOREIGN KEY (userId) REFERENCES app_user(id)
        );""")
    
    cursor.execute("""
        CREATE TABLE messages (
            id SERIAL PRIMARY KEY,
            conversationId INTEGER NOT NULL,
            position INTEGER NOT NULL,
            text TEXT NOT NULL,
            role VARCHAR(50) NOT NULL,
            FOREIGN KEY (conversationId) REFERENCES conversation(id)
        );""")
    
    try:
        connection.commit()
    except Exception as e:
        print("Error committing changes:", e, file=sys.stderr)
        raise e

except Exception as e:
    print("Error creating the database tables:", e, file=sys.stderr)

finally:
    cursor.close()
    connection.close()