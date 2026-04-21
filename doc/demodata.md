# B.Ed Exam Hub - Demo Data

This document contains sample data that can be used to test the application.

## Sample Users

| Name | Email | Username | Password |
|------|-------|----------|----------|
| Demo User | demo@example.com | demouser | password123 |
| Test Admin | admin@test.com | admin | adminpass |
| Student A | student@test.com | student_a | secret123 |

## Sample Subjects

The following subjects are automatically seeded into the database:

- **General Knowledge (GK)**: Current affairs, history, geography.
- **Reasoning**: Logic, series, analogies.
- **Teaching Aptitude**: Teaching methods, psychology.
- **Language**: Grammar, comprehension (Hindi/English).

## Mock Test Scores

You can manually add scores or use the following for testing:

| Candidate Name | Subject | Score | Attempted | Total Questions |
|----------------|---------|-------|-----------|-----------------|
| Demo User | GK | 18 | 20 | 25 |
| Student A | Reasoning | 15 | 18 | 20 |
| Demo User | Teaching Aptitude | 14 | 15 | 20 |

## API Testing

To manually post a score using `curl`:

```bash
curl -X POST http://localhost:4000/api/scores \
-H "Content-Type: application/json" \
-d '{
  "candidateName": "CURL Tester",
  "score": 12,
  "attempted": 15,
  "totalQuestions": 20
}'
```
