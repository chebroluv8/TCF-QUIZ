from flask import Flask, request, jsonify 
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('backend/database/quiz.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users')
    response = cursor.fetchall()
    conn.close()

    user_list = []
    for row in response:
        user_list.append({
            "id": row['id'],
            "first_name": row['first_name'],
            "last_name": row['last_name'],
            "email": row['email'],
            "password": row['password']
        })
    return jsonify([dict(u) for u in user_list])

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', 
                  (email, password))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        # Convert to dict and remove password
        user_dict = dict(user)
        user_dict.pop('password', None)
        return jsonify({"message": "Login successful", "user": user_dict})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/create-user', methods=['POST'])
def add_users():
    # Get JSON data from request
    data = request.json
    
    # Extract user data
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    
    # Basic validation
    if not all([first_name, last_name, email, password]):
        return jsonify({"message": "All fields are required"}), 400
    
    # Connect to database
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if email already exists
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({"message": "Email already exists"}), 400
    
    # Insert new user
    try:
        cursor.execute(
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            (first_name, last_name, email, password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        
        conn.close()
        return jsonify({
            "message": "User created successfully",
            "userId": user_id
        }), 201
    except Exception as e:
        conn.close()
        return jsonify({"message": f"Error creating user: {str(e)}"}), 500
    



@app.route('/questions', methods=['GET'])
def get_questions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM questions')
    response = cursor.fetchall()

    quiz_questions = []
    correct_answer_dict = {
        'A' : 0,
        'B' : 1,
        'C': 2,
        'D' : 3
    }
    for row in response:
        quiz_questions.append({
            "question": row['question'],
            "options": [row['option_a'], row['option_b'],row['option_c'],row['option_d']],
            "correctAnswer": correct_answer_dict[row['correct_answer']]
        })
    conn.close()

    return jsonify([dict(q) for q in quiz_questions])

@app.route('/submitAnswer', methods=['POST'])
def submit_answer():
    data = request.json
    user_id = data['user_id']
    question_id = data['question_id']
    answer = data['answer']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO user_answers (user_id, question_id, answer) VALUES (?, ?, ?)',
                   (user_id, question_id, answer))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Answer submitted successfully'})

@app.route('/scores', methods=['GET'])
def get_scores():
    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM scores WHERE user_id = ?', (user_id,))
    scores = cursor.fetchall()
    conn.close()

    return jsonify([dict(s) for s in scores])

@app.route('/test', methods=['GET'])
def test():
    return 'hello'

if __name__ == '__main__':
    app.run(debug=True)
