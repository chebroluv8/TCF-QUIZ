from flask import Flask, request, jsonify 
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('backend/database/quiz.db')
    conn.row_factory = sqlite3.Row
    return conn

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

    @app.route('/questions', methods=['POST'])
def add_question():
    try:
        data = request.get_json()
    
        if not all(key in data for key in ['question', 'options', 'correctAnswer']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if len(data['options']) != 4:
            return jsonify({'error': 'Exactly 4 options are required'}), 400
        
        if not isinstance(data['correctAnswer'], int) or not (0 <= data['correctAnswer'] < 4):
            return jsonify({'error': 'Invalid correct answer index'}), 400
        
        new_question = {
            'question': data['question'],
            'options': data['options'],
            'correctAnswer': data['correctAnswer']
        }

        questions.append(new_question)
        
        return jsonify({'message': 'Question added successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
