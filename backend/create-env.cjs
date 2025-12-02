const fs = require('fs');

const envContent = `DATABASE_URL=postgresql://postgres:zH4zS2rjKyaK29qW@db.xujysejaploauzmdy1xi.supabase.co:5432/postgres
JWT_SECRET=super-secret-key-change-me
FRONTEND_URL=http://localhost:5173`;

fs.writeFileSync('.env', envContent, 'utf8');
console.log('.env file created successfully');
