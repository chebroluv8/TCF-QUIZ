from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Create absolute path for upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'profile_pics')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create the folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    print(f"Created upload folder at: {UPLOAD_FOLDER}")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
print(f"Upload folder set to: {UPLOAD_FOLDER}")

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
            "password": row['password'],
            "profile_pic": row['profile_pic']
        })
    return jsonify([dict(u) for u in user_list])

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    print(f"Attempting login with email: {email}")  # Debug print
    
    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists with these credentials
    cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', 
                  (email, password))
    user = cursor.fetchone()
    
    if user:
        # Convert user data to dictionary
        user_dict = dict(user)
        print(f"User found: {user_dict}")  # Debug print
        
        # Ensure profile_pic is included
        if 'profile_pic' not in user_dict or not user_dict['profile_pic']:
            user_dict['profile_pic'] = 'default.png'
            
        print(f"Sending user data with profile_pic: {user_dict['profile_pic']}")  # Debug print
        
        return jsonify({
            "message": "Login successful", 
            "user": user_dict
        })
    else:
        print("No user found with these credentials")  # Debug print
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
    
@app.route('/delete-user', methods=['DELETE'])
def delete_user():
    data = request.json
    email = data.get('email')  # or user_id, depending on how you want to identify the user
    
    if not email:
        return jsonify({"message": "Email is required"}), 400
        
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First check if user exists
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return jsonify({"message": "User not found"}), 404
            
        # Delete the user
        cursor.execute('DELETE FROM users WHERE email = ?', (email,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "User deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Error deleting user"}), 500

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200


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


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload-profile-pic', methods=['POST'])
def upload_profile_pic():
    # Print current working directory
    print("Current working directory:", os.getcwd())
    
    # Print the full path of the upload folder
    upload_folder_path = os.path.abspath(app.config['UPLOAD_FOLDER'])
    print("Full upload folder path:", upload_folder_path)
    
    if 'profile_pic' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['profile_pic']
    email = request.form.get('email')
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{email}_{file.filename}")
        print("Attempting to save file:", filename)
        
        # Create upload folder if it doesn't exist
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            print("Creating upload folder")
            os.makedirs(app.config['UPLOAD_FOLDER'])
            
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        print("Full file path:", file_path)
        
        file.save(file_path)
        print("File saved successfully")
        
        # Verify file exists after saving
        if os.path.exists(file_path):
            print("File exists at:", file_path)
        else:
            print("File was not saved correctly!")
        
        # Update database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE users SET profile_pic = ? WHERE email = ?',
            (filename, email)
        )
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'File uploaded successfully',
            'profile_pic': filename
        }), 200
        
    return jsonify({'message': 'File type not allowed'}), 400

@app.route('/profile-pics/<filename>')
def serve_profile_pic(filename):
    print("Requested filename:", filename)
    print("Looking in folder:", os.path.abspath(app.config['UPLOAD_FOLDER']))
    full_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    print("Full path:", full_path)
    print("File exists:", os.path.exists(full_path))
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/user-sets/<user_id>', methods=['GET'])
def get_user_sets(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM question_sets 
        WHERE user_id = ? 
        ORDER BY date_created DESC
    ''', (user_id,))
    
    sets = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(s) for s in sets])

@app.route('/set-questions/<set_id>', methods=['GET'])
def get_set_questions(set_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM questions WHERE set_id = ?', (set_id,))
    questions = cursor.fetchall()
    conn.close()

    quiz_questions = []
    for row in questions:
        quiz_questions.append({
            "question_id": row['question_id'],
            "question": row['question'],
            "option_a": row['option_a'],
            "option_b": row['option_b'],
            "option_c": row['option_c'],
            "option_d": row['option_d'],
            "correct_answer": row['correct_answer']
        })

    return jsonify(quiz_questions)

@app.route('/set-info/<set_id>', methods=['GET'])
def get_set_info(set_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT title, description, category, date_created 
        FROM question_sets 
        WHERE set_id = ?
    ''', (set_id,))
    
    set_info = cursor.fetchone()
    conn.close()
    
    if set_info:
        return jsonify(dict(set_info))
    else:
        return jsonify({"message": "Set not found"}), 404

@app.route('/update-set/<set_id>', methods=['PUT'])
def update_set(set_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE question_sets 
        SET title = ?, description = ?, category = ?
        WHERE set_id = ?
    ''', (data['title'], data['description'], data['category'], set_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Set updated successfully"})

@app.route('/update-question/<question_id>', methods=['PUT'])
def update_question(question_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE questions 
        SET question = ?, option_a = ?, option_b = ?, 
            option_c = ?, option_d = ?, correct_answer = ?
        WHERE question_id = ?
    ''', (data['question'], data['option_a'], data['option_b'], 
          data['option_c'], data['option_d'], data['correct_answer'], 
          question_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Question updated successfully"})

@app.route('/add-question/<set_id>', methods=['POST'])
def add_question(set_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO questions (set_id, question, option_a, option_b, 
                             option_c, option_d, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (set_id, data['question'], data['option_a'], data['option_b'],
          data['option_c'], data['option_d'], data['correct_answer']))
    
    question_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        "question_id": question_id,
        **data
    })

@app.route('/create-set', methods=['POST'])
def create_set():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO question_sets (user_id, title, description, category)
        VALUES (?, ?, ?, ?)
    ''', (data['user_id'], data['title'], data['description'], data['category']))
    
    set_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        "message": "Set created successfully",
        "set_id": set_id
    })

if __name__ == '__main__':
    app.run(debug=True)
