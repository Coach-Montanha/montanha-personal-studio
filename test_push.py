import json
import urllib.request
import time
import random

SUPABASE_URL = "https://muryznvaxzszcffrbxpv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cnl6bnZheHpzemNmZnJieHB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQ0MTE2OSwiZXhwIjoyMTAwMDE3MTY5fQ.SpYzAP5ej1jUKyIPGSowyZrG_eeox50HmKnP1r81a24"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# 1. Busca alunos ativos
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/students?select=id,name&limit=20", headers=headers)
with urllib.request.urlopen(req) as resp:
    students = json.loads(resp.read().decode())

selected_student = random.choice(students)
print(f"Aluno sorteado para o teste: {selected_student['name']}")

# 2. Busca admins
req_adm = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/user_roles?select=user_id&role=eq.admin", headers=headers)
with urllib.request.urlopen(req_adm) as resp:
    admins = json.loads(resp.read().decode())

admin_ids = list(set([a["user_id"] for a in admins])) if admins else ["3f954063-c246-4989-8f48-dc84a12f5be3"]
print(f"Admins de destino: {admin_ids}")

# ETAPA 1: Check-in do Aluno na Turma das 8h
checkin_payloads = [
    {
        "user_id": uid,
        "title": "🔔 Novo Check-in!",
        "message": f"{selected_student['name']} confirmou presença na turma \"Treinamento Híbrido Endurance\" às 08:00.",
        "type": "checkin",
        "metadata": {
            "student_id": selected_student["id"],
            "student_name": selected_student["name"],
            "class_name": "Treinamento Híbrido Endurance",
            "start_time": "08:00:00",
            "is_bonus": False
        }
    }
    for uid in admin_ids
]

req_ins1 = urllib.request.Request(
    f"{SUPABASE_URL}/rest/v1/pt_notifications",
    data=json.dumps(checkin_payloads).encode(),
    headers=headers,
    method="POST"
)
with urllib.request.urlopen(req_ins1) as resp:
    print(f"✅ [CHECK-IN ENVIADO] {selected_student['name']} na turma das 08:00 (Status: {resp.status})")

# Intervalo de 3 segundos
time.sleep(3)

# ETAPA 2: Feedback da Turma das 8h (Aviso 20 min)
reminder_payloads = [
    {
        "user_id": uid,
        "title": "⏰ Aula em 20 min (08:00 - Treinamento Híbrido Endurance)",
        "message": f"1 aluno(s) com check-in: {selected_student['name']}. Prepare o espaço para a sessão.",
        "type": "class_reminder_20m",
        "metadata": {
            "class_name": "Treinamento Híbrido Endurance",
            "start_time": "08:00:00",
            "attendee_count": 1,
            "attendees": [selected_student["name"]]
        }
    }
    for uid in admin_ids
]

req_ins2 = urllib.request.Request(
    f"{SUPABASE_URL}/rest/v1/pt_notifications",
    data=json.dumps(reminder_payloads).encode(),
    headers=headers,
    method="POST"
)
with urllib.request.urlopen(req_ins2) as resp:
    print(f"✅ [FEEDBACK 08H ENVIADO] Resumo da aula das 08:00 entregue aos treinadores (Status: {resp.status})")

print("--- TESTE FINALIZADO COM SUCESSO ---")
