CREATE TABLE IF NOT EXISTS question_sets (
    set_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS questions (
    question_id INTEGER PRIMARY KEY AUTOINCREMENT,
    set_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    question_difficulty TEXT NOT NULL,
    FOREIGN KEY (set_id) REFERENCES question_sets(set_id)
);

CREATE TABLE IF NOT EXISTS user_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,     
  user_id INTEGER,                         
  set_id INTEGER,                          
  score INTEGER,                           
  correct INTEGER,                         
  incorrect INTEGER,                       
  easy_correct INTEGER,                    
  medium_correct INTEGER,                  
  hard_correct INTEGER,                    
  date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_pic TEXT DEFAULT 'default.png',
    login_count INTEGER DEFAULT 0,
    quiz_count INTEGER DEFAULT 0,
    lifetime_score INTEGER DEFAULT 0
);