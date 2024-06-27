import psycopg2

class DatabaseManager:
    def __init__(self, database_name="postgres", user_name="postgres", password="12345"):
        try:
            self.connection = psycopg2.connect(
                host="localhost",
                database=database_name,
                user=user_name,
                password=password,
                port=5432
            )

            print("Connected to the database")
        except Exception as e:
            print("Error connecting to the database:", e)

    def get_connection(self):
        if hasattr(self, "connection"):
            return self.connection
        else:
            raise Exception("DatabaseManager class not initialized. Connection not established.")
    
    def commit_changes(self):
        try:
            self.connection.commit()
            return True
        except Exception as e:
            print("Error committing changes:", e)
            self.close_connection()
            return False
    
    def close_connection(self):
        try:
            self.connection.close()
        except Exception as e:
            print("Error closing connection:", e)
    
    def save_conversation(self, username, data):
        print(f"Data to save:\n{data}")
        
        try:
            cursor = self.get_connection().cursor()
            
            # Find the id of the user
            cursor.execute(f"""
                SELECT id FROM app_user WHERE username = %s;
            """, (username,))
            user_id = cursor.fetchone()[0]
            print(f"User id: {user_id}")
            
            # Create a new conversation
            cursor.execute(f"""
                INSERT INTO conversation (userId) VALUES (%s)
                RETURNING id;
            """, (user_id,))
            conversation_id = cursor.fetchone()[0]
            print(f"Conversation id: {conversation_id}")
            
            for message in data['messages']:
                print(f"Message: {message}")
                # Save the messages
                cursor.execute(f"""
                    INSERT INTO messages (conversationId, position, text, role)
                    VALUES (%s, %s, %s, %s);
                """, (conversation_id, message['position'], message['text'], message['role']))
            
            # Commit the changes
            success = self.commit_changes()
            
            return success
        except Exception as e:
            print("Error saving conversation:", e)
            return False
    
    def get_older_conversations_header(self, username):
        cursor = self.get_connection().cursor()
        
        cursor.execute(f"""
            SELECT m.text
                FROM messages m
                JOIN conversation c ON m.conversationId = c.id
                JOIN app_user u ON c.userId = u.id
                WHERE u.username = %s
                AND m.position = 0
                ORDER BY c.id;
        """, (username,))
        
        rows = cursor.fetchall()
        
        return rows