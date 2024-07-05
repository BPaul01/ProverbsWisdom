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
    
    def check_credentials(self, username, password):
        cursor = self.get_connection().cursor()
        
        cursor.execute("""
            SELECT id FROM app_user WHERE username = %s AND password_hash = %s;
        """, (username, password))
        
        user_id = cursor.fetchone()
        
        cursor.close()
        
        if user_id:
            return True
        else:
            return False
    
    def create_user(self, username, password):
        try:
            cursor = self.get_connection().cursor()
            
            cursor.execute("""
                SELECT username FROM app_user WHERE username = %s;
            """, (username,))
            
            if cursor.fetchone():
                cursor.close()
                return False
            
            cursor.execute("""
                INSERT INTO app_user (username, password_hash) VALUES (%s, %s);
            """, (username, password))
            
            success = self.commit_changes()
            
            cursor.close()
            
            return success
        except Exception as e:
            print("Error creating user:", e)
            cursor.close()
    
    def save_conversation(self, username, data, summary):
        if len(summary) > 512:
            summary = summary[:512]
        try:
            cursor = self.get_connection().cursor()
            
            # Find the id of the user
            cursor.execute("""
                SELECT id FROM app_user WHERE username = %s;
            """, (username,))
            user_id = cursor.fetchone()[0]
            
            # Create a new conversation
            cursor.execute("""
                INSERT INTO conversation (userId, summary) VALUES (%s, %s)
                RETURNING id;
            """, (user_id, summary))
            conversation_id = cursor.fetchone()[0]
            
            for message in data['messages']:
                print(f"Message: {message}")
                # Save the messages
                cursor.execute("""
                    INSERT INTO messages (conversationId, position, text, role)
                    VALUES (%s, %s, %s, %s);
                """, (conversation_id, message['position'], message['text'], message['role']))
            
            # Commit the changes
            success = self.commit_changes()
            
            cursor.close()
            
            return success
        except Exception as e:
            print("Error saving conversation:", e)
            cursor.close()
            return False
    
    def get_older_conversations_header(self, username):
        cursor = self.get_connection().cursor()
        
        cursor.execute("""
            SELECT c.summary FROM conversation c
            JOIN app_user u ON c.userId = u.id
            WHERE u.username = %s
            ORDER BY c.id;
        """, (username,))
        
        # cursor.execute("""
        #     SELECT m.text
        #         FROM messages m
        #         JOIN conversation c ON m.conversationId = c.id
        #         JOIN app_user u ON c.userId = u.id
        #         WHERE u.username = %s
        #         AND m.position = 0
        #         ORDER BY c.id;
        # """, (username,))
        
        rows = cursor.fetchall()
        
        cursor.close()
        
        return rows
    
    def get_old_conversation(self, username, position_of_conversation):
        position_of_conversation = int(position_of_conversation)
        
        cursor = self.get_connection().cursor()
        
        # Find the id of the conversation
        cursor.execute("""
            SELECT c.id
            FROM conversation c
            JOIN app_user u ON c.userId = u.id
            JOIN messages m ON c.id = m.conversationId
            WHERE u.username = %s
            AND m.position = 0
            ORDER BY c.id
        """, (username,))
        rows = cursor.fetchall()
        c_id = rows[position_of_conversation][0]
        print("Conversation id:", c_id)
        
        # Get all the messages of the older conversation
        cursor.execute("""
            SELECT m.text, m.role, m.position
            FROM messages m
            JOIN conversation c ON m.conversationId = c.id
            WHERE c.id = %s
            ORDER BY m.position;
        """, (c_id,))
        rows = cursor.fetchall()
        
        cursor.close()
        
        return rows