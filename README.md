# Medrin Jobs Portal

## Project Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- VSCode
- Git (optional but recommended)

### Frontend Setup
1. Open terminal in VSCode and run:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

### Backend Setup
1. Open a new terminal in VSCode and run:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend will run on: http://localhost:5000

### VSCode Extensions
Install these recommended extensions for better development experience:
- ES7+ React/Redux/React-Native snippets
- Python
- Prettier
- ESLint
- Tailwind CSS IntelliSense