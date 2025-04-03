-- First create the question_sets table
CREATE TABLE IF NOT EXISTS question_sets (
    set_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create a default set for existing questions
INSERT INTO question_sets (user_id, title, description, category) 
VALUES (1, 'Default Set', 'Original questions', 'General');

-- Create temporary table to hold existing questions
CREATE TABLE temp_questions AS SELECT * FROM questions;

-- Drop the old questions table
DROP TABLE IF EXISTS questions;

-- Create the new questions table
CREATE TABLE questions (
    question_id INTEGER PRIMARY KEY AUTOINCREMENT,
    set_id INTEGER NOT NULL DEFAULT 1,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    question_difficulty TEXT NOT NULL DEFAULT 'medium',
    FOREIGN KEY (set_id) REFERENCES question_sets(set_id)
);

-- Move the existing questions to the new table (without question_difficulty)
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, set_id)
SELECT question, option_a, option_b, option_c, option_d, correct_answer, 1
FROM temp_questions;

-- Drop the temporary table
DROP TABLE IF EXISTS temp_questions;