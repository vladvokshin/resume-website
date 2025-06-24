from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Настройка базы данных SQLite в текущей папке
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///resumes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Модель резюме
class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.String(10), nullable=False)
    education = db.Column(db.Text, nullable=False)
    achievements = db.Column(db.Text)
    skills = db.Column(db.Text, nullable=False)
    experience = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'education': self.education,
            'achievements': self.achievements,
            'skills': self.skills,
            'experience': self.experience
        }

# Создаем базу данных при первом запуске
with app.app_context():
    db.create_all()

# Маршрут для сервировки страницы index.html
@app.route('/')
def index():
    return send_from_directory('', 'index.html')

# API: получить все резюме
@app.route('/api/resumes', methods=['GET'])
def get_resumes():
    resumes = Resume.query.all()
    return jsonify([r.to_dict() for r in resumes])

# API: добавить новое резюме
@app.route('/api/resumes', methods=['POST'])
def add_resume():
    data = request.json
    new_resume = Resume(
        name=data['name'],
        age=data['age'],
        education=data['education'],
        achievements=data.get('achievements', ''),
        skills=data['skills'],
        experience=data['experience']
    )
    db.session.add(new_resume)
    db.session.commit()
    return jsonify(new_resume.to_dict()), 201

if __name__ == '__main__':
    app.run(debug=True)
