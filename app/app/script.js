let allResumes = [];

async function fetchResumes() {
  const response = await fetch('/api/resumes');
  if (response.ok) {
    const data = await response.json();
    allResumes = data;
    displayResumes(data);
  } else {
    alert('Ошибка загрузки данных');
  }
}

function displayResumes(resumes) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  resumes.forEach(r => {
    const div = document.createElement('div');
    div.className='resume';
    div.innerHTML= `
      <h3>${r.name}</h3>
      <p><strong>Возраст:</strong> ${r.age}</p>
      <p><strong>Образование:</strong> ${r.education}</p>
      <p><strong>Достижения:</strong> ${r.achievements}</p>
      <p><strong>Навыки:</strong> ${r.skills}</p>
      <p><strong>Опыт работы:</strong> ${r.experience}</p>
      <hr />
    `;
    container.appendChild(div);
  });
}

document.getElementById('resumeForm').addEventListener('submit', async e => {
  e.preventDefault();
  
  const data={
    name: document.getElementById('name').value.trim(),
    age: document.getElementById('age').value.trim(),
    education: document.getElementById('education').value.trim(),
    achievements: document.getElementById('achievements').value.trim(),
    skills: document.getElementById('skills').value.trim(),
    experience: document.getElementById('experience').value.trim()
  };

  const response= await fetch('/api/resumes', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const newResume= await response.json();
    allResumes.push(newResume);
    
    // Обновляем список отображения
    displayResumes(allResumes);
    
    // Очистить форму
    document.getElementById('resumeForm').reset();
    
  } else {
    alert('Ошибка при сохранении');
  }
});

document.getElementById('searchInput').addEventListener('input', () => {
  const query= document.getElementById('searchInput').value.toLowerCase();
  
  const filtered= allResumes.filter(r =>
     r.name.toLowerCase().includes(query) ||
     r.skills.toLowerCase().includes(query) ||
     r.experience.toLowerCase().includes(query) ||
     r.education.toLowerCase().includes(query) ||
     r.achievements.toLowerCase().includes(query)
   );
   
   displayResumes(filtered);
});

// Загружаем все резюме при старте страницы
fetchResumes();
