export const mockQuestions = [
    ["Active learning in class is best improved by", ["Monologue", "Group activity", "No interaction", "Copy work"], 1],
    ["Formative assessment helps to", ["Punish learners", "Support learning progress", "Cancel exams", "Reduce attendance"], 1],
    ["Next number: 2, 4, 8, 16, ?", ["24", "30", "32", "34"], 2],
    ["Synonym of 'Calm'", ["Noisy", "Peaceful", "Rough", "Tough"], 1],
    ["Inclusive education means", ["Only toppers", "Equal opportunity", "No exams", "No activities"], 1],
    ["If CAT = DBU, DOG = ?", ["EPH", "EPI", "FQI", "EOH"], 0],
    ["10% of 250 =", ["20", "25", "30", "35"], 1],
    ["Antonym of 'Expand'", ["Stretch", "Grow", "Contract", "Increase"], 2],
    ["Child-centered education focuses on", ["Teacher talk", "Learner needs", "Punishment", "Silence"], 1],
    ["The odd one out: Apple, Banana, Carrot, Mango", ["Apple", "Banana", "Carrot", "Mango"], 2],
    ["A lesson plan helps in", ["Confusion", "Objective delivery", "No teaching", "Random tasks"], 1],
    ["15, 30, 60, 120, ?", ["160", "180", "220", "240"], 3],
    ["Correct sentence", ["She go to school", "She goes to school", "She going school", "She gone school"], 1],
    ["Teaching aptitude includes", ["Empathy", "Only strictness", "No planning", "Only marks"], 0],
    ["Square of 14", ["176", "186", "196", "206"], 2],
    ["National education policy relates to", ["Transport", "Education system", "Sports clubs", "Tourism"], 1],
    ["Best exam strategy", ["No mocks", "Planned revision", "Last-minute panic", "Skip weak topics"], 1],
    ["2/5 of 200", ["70", "75", "80", "85"], 2],
    ["The opposite of 'Ancient'", ["Historic", "Old", "Modern", "Classic"], 2],
    ["Peer learning supports", ["Isolation", "Collaboration", "Confusion", "Silence"], 1],
    ["Time at 3:00 has angle", ["45", "60", "90", "120"], 2],
    ["Classroom management includes", ["Seating and engagement", "Only attendance", "Only punishments", "Only tests"], 0],
    ["Find next: 1, 4, 9, 16, ?", ["20", "25", "30", "36"], 1],
    ["Correct spelling", ["Enviroment", "Environment", "Envirnoment", "Environmant"], 1],
    ["Assessment for learning is", ["Summative only", "Formative process", "No feedback", "No records"], 1],
    ["If 8 workers finish in 12 days, in 6 days workers needed", ["12", "14", "16", "18"], 2],
    ["Best source for exam updates", ["Random posts", "Official website", "Unknown blogs", "Rumors"], 1],
    ["A good teacher should", ["Discourage questions", "Encourage curiosity", "Avoid preparation", "Ignore diversity"], 1],
    ["Average of 10 and 20", ["12", "14", "15", "16"], 2],
    ["Choose synonym of 'Brief'", ["Long", "Short", "Heavy", "Rigid"], 1],
    ["Remedial teaching is for", ["Only toppers", "Extra learner support", "No learners", "Only sports"], 1],
    ["Next term: 5, 10, 20, 40, ?", ["60", "70", "80", "90"], 2],
    ["Curriculum refers to", ["Random content", "Planned learning experiences", "Only textbooks", "No outcomes"], 1],
    ["12 x 8 =", ["84", "86", "96", "106"], 2],
    ["Choose antonym of 'Optimistic'", ["Hopeful", "Positive", "Pessimistic", "Confident"], 2],
    ["Bloom's taxonomy includes", ["Remember and apply", "Sleep and wake", "Run and jump", "Draw and print"], 0],
    ["LCM of 6 and 8", ["18", "24", "30", "36"], 1],
    ["Activity-based learning is", ["Passive", "Experiential", "Rigid", "Isolated"], 1],
    ["Plural of 'Child'", ["Childs", "Children", "Childes", "Childrens"], 1],
    ["Aptitude test checks", ["Potential and suitability", "Only memory", "Only writing speed", "Only marks"], 0],
    ["Simple interest on 1000 at 10% for 1 year", ["50", "80", "100", "120"], 2],
    ["Constructive feedback should be", ["Delayed", "Specific and timely", "Harsh", "Public"], 1],
    ["If EAST becomes WEST, left of NORTH is", ["EAST", "WEST", "SOUTH", "UP"], 0],
    ["Choose correct: They ___ completed the work.", ["has", "have", "is", "was"], 1],
    ["Main aim of education", ["Only rank", "Holistic development", "Only job", "Only exam"], 1],
    ["3/4 of 160", ["110", "120", "130", "140"], 1],
    ["Questioning in class improves", ["Fear", "Thinking", "Absenteeism", "Silence"], 1],
    ["Error spotting: 'He do his homework.'", ["He", "do", "his", "homework"], 1],
    ["Democratic classroom climate promotes", ["Participation", "Suppression", "Bias", "Fear"], 0],
    ["Final series term: 7, 14, 21, 28, ?", ["32", "35", "36", "38"], 1]
];

export const questionsBySubject = {
    gk: [1, 7, 10, 15, 20, 24, 31, 35, 39, 42, 45, 47, 48, 50].map(i => mockQuestions[i - 1]).filter(Boolean),
    ta: [0, 4, 8, 13, 18, 25, 27, 28, 32, 36, 41, 43, 49].map(i => mockQuestions[i]).filter(Boolean),
    reasoning: [2, 5, 11, 19, 21, 23, 26, 29, 33, 34, 37, 38, 40, 44, 46].map(i => mockQuestions[i]).filter(Boolean),
    language: [3, 6, 9, 12, 14, 16, 17, 22, 30].map(i => mockQuestions[i]).filter(Boolean)
};

export const practiceQuestions = [
    {
        q: "Which method is most effective for active classroom learning?",
        options: ["One-way lecture only", "Group discussion and participation", "Silent reading", "Memorization only"],
        answer: "B"
    },
    {
        q: "In reasoning, which comes next: 3, 6, 12, 24, ?",
        options: ["30", "36", "48", "54"],
        answer: "C"
    },
    {
        q: "Child-centered education mainly focuses on:",
        options: ["Teacher convenience", "Exam pressure only", "Learner needs and interests", "Strict punishment"],
        answer: "C"
    },
    {
        q: "Choose the correct synonym of 'Brief':",
        options: ["Lengthy", "Short", "Complex", "Heavy"],
        answer: "B"
    }
];
