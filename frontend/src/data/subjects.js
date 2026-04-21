export const subjects = [
    { id: "gk", name: "📘 General Knowledge", description: "Current affairs, history, geography", color: "#0b6e4f" },
    { id: "ta", name: "🎓 Teaching Aptitude", description: "Teaching methods, psychology", color: "#165a52" },
    { id: "reasoning", name: "🧠 Reasoning", description: "Logic, series, analogies", color: "#1a5a51" },
    { id: "language", name: "✍️ Language", description: "Grammar, comprehension", color: "#1e5a50" }
];

export const subjectDetails = {
    gk: {
        title: "Subject: General Knowledge (Example Page)",
        subtitle: "Prepare for B.Ed Entrance Exam 2026 with a complete breakdown of topics and practice tests.",
        overview: "This section tests your awareness of current events, general studies, and basic concepts important for the B.Ed Entrance Exam 2026.",
        sections: [
            {
                heading: "Indian History",
                notesLink: "/notes/gk-indian-history.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/pGBvQ7pO-GN9zMlI6Q9PqExfiHWC-38rZd088vkM08mFTZfTAN21KSH1Vt1-5FTz3wXROPOhVa9E4YpGD_24n80msuTf4vrB1_OO0giQTIc77igRbjsfauImADzR54glE60pFtrd2dFaUQLvKOz6OktPC3VLz_14T-ZortSWNKuCxnhWxOEzC6_JFSrOmqu3?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/nDYqVs2iDZJ3jcoYJjupMswW46gEdSR834mMGgL6Pm5NfA8YMdwi4T9FTBBr5lqWsL84oAMh9Cr3kHPgIVESVDvKcZisNn5C_tEZgDEJq1LWVmhPdzmIJSYRhB-k5ponnGTc5Cc5PG3uXFp6LWfb4ZYf0Ey5OKHKeJ6qhgS_IPdSMdxisnNIyH7K9QMDFGnG?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/rlWteADXYgB0u_7XhIsnllUFwHH2k_NJe8m3qnCqqE2iRort5Mw9hTXrvhhOdT-XQf_0-DMEj0bwmKFF3W2grXNDbH2hfnVCRFz7eVQHU8vchlt96r8ZEveWhWd3wVCw47l3YpkD2NIUWscb-kcMZfjsXCIS0mTXCdIpaSeJDjzQVm4-4IAIjKBrI2KgUAuv?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/uOV0T2_vr7lPd4FA1UfAG-Oga1tfroEmkalnL1dwDVHVc5xgsxdwOH-8RMW0xaKFDPzTk-yte43D66dTvOZ5a-4sjt38UGLrE_qtUAjc4SH5bCfX--pjIVmQWg5lFl1QOMz-OWYtd2zVUNn_W-le_qkc7vTnt3dI0TsBVASp-e4Qs3YClwLp2CvbjdHZ-OLb?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/SGX1gXbyfPct1VRO6gsxntxROkB0TCwojnx5ZKSo720ZA2KI02k3rqt2bog9yuZDCgj6PmFz99WoVJQBTGXP_VRfGsAiSEu7sh4Yi_LGtFc7MrCWrW4FUQ6Pv-3R4Zvr9w7TZRFug9Uzu7UykJI2_UFKopCgJaoFY5tLRGUh1GksXYsfIMQEx6B8xkkxVrhR?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/MWZe5nnGy7SwQAh4iPL1HK0cSmWtRMcgjV-j1nzZ1ceQwffnYdjgTErmKYd2GkxqvvgYhFUt2dm2SeBEh1WUjd1CpxySUh3iRRPalJSSWqAQlKJ8cN5ZK0ak4BohUvJxpu59GcwKNBpbPdK2E06-Y1-XtDpLVxvXd5pkG8NVT8k7AQOb4_Kyarve3z7EISTU?purpose=fullsize"
                ],
                topics: [
                    "Ancient History (Indus Valley, Vedic Period)",
                    "Medieval History (Delhi Sultanate, Mughal Empire)",
                    "Modern History (British Rule, Freedom Struggle)",
                    "Important Personalities & Movements"
                ]
            },
            {
                heading: "Geography",
                notesLink: "/notes/gk-geography.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/3VCeybdTdl3l4BJ0wJkpR0iMMRax_PbzhXQYpcgEdjZvPib9wnUY52N65w1oXW2NO1hK8eau1BlnLBZxF42aZ-KpV8LVLLvRu-B4_bhOjwyqIk7okEOiZIHqAwHCdpRCdrgcLjSE4fwOihOR0UDF4AH8pZqfFflqiQiIPuca41t3G9MJxyaTkwxKm8xMc53U?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/q-n_zixM30PivBHNkoOyDM66nGHi7Fa_zqRua_bgym84CE-jJma6R_TbO_SSU00ctX_sb79VhHhaXA9qJotOwob3YvFhF4FsTXswxr2lOHiZCRolHwG-Xlqv9kIMEemMcPvy1TVUbXJKeGzevGJGZK6J4db6j4AqB-D8cFYa9VwtfF4BMVh0iefZZ4U2cr3N?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/H5gX0w5o0L-cc78nC81neLN9LiXgZ5hL2SN0_OpYK_GTVvg1flxBq4qjtx8IDxAkww5R4UqmBN4EvzrmfcnptH8uh7COdWqUK9WOPVpVNfPdvkq_RY-ZWA-ZHh2HRuX23qTLedjBWq6HWw9IqJzpCINBTOihdHhp7LUlIXsEXjnUasybNzYmPa2p3pua2q6L?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/9nPLahXPxKpBX6g7TBzdRRznaB88fSVCDmjec5UZ4c_Bnnlx-xWqXNIOUWNIOuvliDI1LuasvaCbT_CaPNDegBB1qNIU04E7Jb0hkRXXzqkN4cY1e9WQ4kWXgjmOP_FyrO58e55_fuPWXB1PbnD30dI2ou0gdlQftFwWJeOoxJW1-qg4-tnPxbdM7fVYajH_?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/NayPh8ea-hQPVcqcASfjm6yd92PvGbd4lBGzqOpNfz7mfevRfD8749vZO9XGdxSdYEwqXwM2ux0V2zfqcNdrQ9pScbsSaikfo6Zn4pU5hl2mCYzRZ5abbL3vhsfp2LRSs8eIxkCln4ZKmXI3InDDkSgOrbQlyoCE9JLVX8feti-0rYxWy5njjMgjx48U7ftl?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/w7yIlW7PckWojQOa9efFqPxhf2s2BM4fDZXvUvCEIfRc5vzMx7yOPKUTw8B_DHdVetU8t80mjXt0IcM6yJJ0iGRjgEG2W3sSACUK0wtUlIbcAKIc-S0zWrDjJNdMGqRU9XV3cwisfUFLXTD4nWOImUlqcFFNwP1wKu4uAW2-NOB8KpmNL3Iz-YUi5MofCz8d?purpose=fullsize"
                ],
                topics: [
                    "Physical Geography (Mountains, Rivers, Climate)",
                    "Indian Geography",
                    "World Geography basics",
                    "Natural Resources"
                ]
            },
            {
                heading: "Indian Polity",
                notesLink: "/notes/gk-indian-polity.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/J1SjoP1GRatGoA_PRAzL3tDVTNfJXXbHcg7hPHScCH_6-gMhOsxUNjzj-oVs3SBIKWeTDXtL-x9VNXNbmbW173nUW4S-SWaHUaP0KW5R_xGYSgEKWzMMUL0lbyR30nVJXo6BFcbbWqcf2CkqlYHkyCZMzYTWX8wmUAJ53E3arn24S0mdIPOrM8xeVgOu1xbY?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/zxG_5zN3bDNohyvmujSzPreUsYAIYJRbZoek0RGGH8gSCQ-cqCmBwBhmo7-bzYWuxC3iIVMBXhNWfErE5AzcoCk04sgd66rSoevH1pO7asqRYhYyHJQ4XsLwTQJCI26ogl_KyquZ0yTu9w0dZ-GlfzqhnVBwl0HVMeqC6CDpFRfi2Mj9wAzCPxV6MjsV_Vou?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/3lXFYTwvQ8579XSgUYMTJu6Qt9Un-L61EhujTacN7XLev0nzse_w09aEKpVzcQIKcNrHS8Wu4p9WUyIXQAT06xeA4EIg3LQiC_RlDTLDnm5iDECEQwo3rAYq5OjPs-pyySaXYfZn1pcZKLm9k5l2AaQ646Ob-CDI2Hbnpwi1Bjef1XTuOEgOhQp1204HA3IW?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/oQNY7mDJuNC4oEXLIQx_tozG4sOfgzomUaDNRFIFh0aGnDB-aWK9lSAYdDLar9ZVTlR13BmGK2NZ9elPbFYaqdlmnq2TMmmI0Ch2QhKzzU_bGtI5aG3KrRiWKY65Z4GMX3POLJrknjOwGAGBFJJddMSrEv_xVJlaT7zw8QDD2MgVaV2-bT0TjAHEkmUkcCgL?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/JyJWlQzraS1dCE0VpzqNmxmLI3G4XBjOM7_92yMJqp1vO3dmgpcyLwsnBddq6XnDesbWdLDhg_LVwN2OtjT9lHgP9VQKTVjmxiQ5KAIJz3G8XMOAGG-96iwmyrsr4TKNTsDMrRJvFevnJUapd065GARjdG7vUZDF1IzCLvHViqLeFEh-lfaJIpjV-dQ60kIg?purpose=fullsize"
                ],
                topics: [
                    "Constitution of India",
                    "Fundamental Rights & Duties",
                    "Government Structure (Executive, Legislature, Judiciary)",
                    "Panchayati Raj"
                ]
            },
            {
                heading: "Current Affairs",
                notesLink: "/notes/gk-current-affairs.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/RdyWXp9TP1lS-T46sOmbzqsLw6e7Zz_WgYW4EaMpq4aND50SuPSGUvBwjTowBfJErCarK3rE63OE8LQD7T28l3QSTmHG4mr358L29ujKQHLgd51zhNGo2eZy5qaiBdbDSh0xJW-jWpS2SloWkezlwnUDtV_unTrNw4uCC44_v04NDSXiiiin3vBSEaV7KA96?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/5hZrMaxhAT5h9TpVuzia4_dcLBVhYBfmkESmVJZ-179GzI9kipjTHZZHaPd9HxuVG64bNEL5hz8lvDLgJaUVKmKeLnSncYmkVg88LQJu2r0KGAvnchhSRr-o84lgPUHkVfNj7bgeq8dALLl-hq2vvZLnPNcVVXA7KcnWU7uwcwAFr_otWnlI2ikK7HFTmIx7?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/os-oJ1_obofqH53N6tEFEZJc7jLQ8db2hpE4ewjBlVRYlr_cpWpz7SJN2RMCxJaIq97Tz9Jfris4R67MmnqA1iMaPaiqIS5C08Ns6YUYL5ma8GxGuEP0xs83Al4IEWl90zGJsq7taMIYXm1In1pXhL29MIK1OP5xIb-AZ_pXBGg53FACvcknGPgDxNBpgAjh?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/PZuM5kqDsCxRkTxTtZefBMvoQo1Ei9b8wZHAu1w6Tcu3GPCCyx0pZ9ymgA11yJf0oGdBx6Km7ohkXhJC3n5NDaczXM2-s4iBCzRA48d1TeS57MzVCCf7bIiw0EnCiCLNZWKHO1skg9lXAq6GITojDrYJkqa2_d6TepO-Un5IQK3cff4jH9OcNAnhlvzzQqt8?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/AuHbR2ystq9wghSeWxOez1EpbcrmOVsoJ6SvIfMHaM8a0Hg-I72fK9vj2AfijMUF6yrcNx8QeQuvYQEsmy-DUlkHr23vfhuDwiScO4EoHD0t9Gr4fatvxOKMv9p6VjNlbo9M8cNRIuNbrPAwHv-TcjDgBDbLEnbH4qwIn_wXi4PRe5H8Ss7Dr3_TiNHqnDGp?purpose=fullsize"
                ],
                topics: [
                    "National & International News",
                    "Awards & Honors",
                    "Sports Events",
                    "Government Schemes"
                ]
            },
            {
                heading: "General Science",
                notesLink: "/notes/gk-general-science.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/ws8drbYScTmljThnuSlTzDGER82VZ37R7cd5lLOTHya5VzPb_xleA4ibAsUQnG57dW5mBmePcOunTU-D9hwXeuguRgIwakwcexqtOy57CjleLtNvZYKpw7uZhGLsfrQacIuNp5CXn9A44WNUc1gbawEZr-Gg5OaE45EkTbtZLOwlx5QDEZhzqc9J5Cxihehu?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/UXZvp0BassHzntyOU90rJ57hzR2UqDOFrSAD1-bUAoqOT59byKJOog82IgdcxdaIuO5_hjvKcLLIY5Xu9LbLTupG61dYxMqDjptcmVzGUX9onb5pW2avv-th4FYVc1817hvSFMaiw7jUos_oSHXRHMACzXNBbtIjUIDYyUXGjbLggfkONNYJi1F8cv8k6m3R?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/09OYl-8vtR4Xp3aXAHp8IuniOg65IS0ODKAotklh4K9p7Z7r4NG3OjRjOENOvuBvwmSnwIHWsGiR4C84zCBWsnN52bn1FBVQvN4ogRKb5YmfwSfxAqC2FfXD26M5Rp75NX9omnWzEpHqp2SM-gZytaoGNnpSA4etprWwE0ItOx1hHRWUhvgR25Y7SSI-nV9K?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/bZt60yFk2HlEQM4dEipMK6emT8KlV7EupFgVlTpi0mEkpjvFts8lltM5qulmuYK85zOaC7SmPLV3MOxyGpSQ3gA0xdSqgijAY7fKpEal8ipmK8ODI19Da9CgNoqsRZwIunBCw29gzBd3Jbvw9qisxgDY3mz4YRsaerqXcwpqRqJ5YZlhJ_-ukC07iQ7WeWYr?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/L8GI_m0A_a6wHupPPKbsNqSp9lRlBxEud4nsTJ2st6JaD-ughpaQ7IeyX1t_wC57Od3bkWPQAN2lnC6xXo_q7xCB2VsFUb_pk4YKE0gC8hCz1bxgyd31dWSscZ49qGBuA-NttNldExdZFEJapByDxaf4UC4zSRSR5HwnoPntUzvNVzSre0BaFimKc5cXTIZh?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/TN3Cms00TzVQ1o3B1ty1Y_6kael9-mZmPGC8GELXnUgtI5eYAB1LBEfM6lNP22OxnZ5Xa7EjIWmnWc-_9SsZKEd0y5kNUddyHNyFnaYJrVpI4KPUkEegtQpRxo4FUjFSx9bbdvkRfMXEEDcxcF-lIs-Fw4u33xSXyo0lrsY0ic0PDWHuoXXX6Rqt07DTPZsX?purpose=fullsize"
                ],
                topics: [
                    "Physics basics (Motion, Energy)",
                    "Chemistry basics (Elements, Reactions)",
                    "Biology basics (Human Body, Plants)",
                    "Everyday Science"
                ]
            }
        ],
        examPattern: {
            totalQuestions: "15-25",
            type: "Multiple Choice Questions (MCQs)",
            difficulty: "Easy to Moderate"
        },
        notesLink: "/question-bank-gk.txt"
    },
    reasoning: {
        title: "Subject: Reasoning Ability",
        subtitle: "Build logical thinking and problem-solving skills for the B.Ed entrance exam.",
        overview: "This section tests your logical and analytical thinking with verbal and non-verbal reasoning questions.",
        sections: [
            {
                heading: "Verbal Reasoning",
                notesLink: "/notes/reasoning-verbal.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/H5gX0w5o0L-cc78nC81neLN9LiXgZ5hL2SN0_OpYK_GTVvg1flxBq4qjtx8IDxAkww5R4UqmBN4EvzrmfcnptH8uh7COdWqUK9WOPVpVNfPdvkq_RY-ZWA-ZHh2HRuX23qTLedjBWq6HWw9IqJzpCINBTOihdHhp7LUlIXsEXjnUasybNzYmPa2p3pua2q6L?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/9nPLahXPxKpBX6g7TBzdRRznaB88fSVCDmjec5UZ4c_Bnnlx-xWqXNIOUWNIOuvliDI1LuasvaCbT_CaPNDegBB1qNIU04E7Jb0hkRXXzqkN4cY1e9WQ4kWXgjmOP_FyrO58e55_fuPWXB1PbnD30dI2ou0gdlQftFwWJeOoxJW1-qg4-tnPxbdM7fVYajH_?purpose=fullsize"
                ],
                topics: ["Analogy", "Classification", "Series", "Coding-Decoding"]
            },
            {
                heading: "Analytical Reasoning",
                notesLink: "/notes/reasoning-analytical.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/3VCeybdTdl3l4BJ0wJkpR0iMMRax_PbzhXQYpcgEdjZvPib9wnUY52N65w1oXW2NO1hK8eau1BlnLBZxF42aZ-KpV8LVLLvRu-B4_bhOjwyqIk7okEOiZIHqAwHCdpRCdrgcLjSE4fwOihOR0UDF4AH8pZqfFflqiQiIPuca41t3G9MJxyaTkwxKm8xMc53U?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/q-n_zixM30PivBHNkoOyDM66nGHi7Fa_zqRua_bgym84CE-jJma6R_TbO_SSU00ctX_sb79VhHhaXA9qJotOwob3YvFhF4FsTXswxr2lOHiZCRolHwG-Xlqv9kIMEemMcPvy1TVUbXJKeGzevGJGZK6J4db6j4AqB-D8cFYa9VwtfF4BMVh0iefZZ4U2cr3N?purpose=fullsize"
                ],
                topics: ["Syllogism", "Statement & Conclusion", "Cause and Effect", "Puzzle-based questions"]
            },
            {
                heading: "Non-Verbal Reasoning",
                notesLink: "/notes/reasoning-non-verbal.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/NayPh8ea-hQPVcqcASfjm6yd92PvGbd4lBGzqOpNfz7mfevRfD8749vZO9XGdxSdYEwqXwM2ux0V2zfqcNdrQ9pScbsSaikfo6Zn4pU5hl2mCYzRZ5abbL3vhsfp2LRSs8eIxkCln4ZKmXI3InDDkSgOrbQlyoCE9JLVX8feti-0rYxWy5njjMgjx48U7ftl?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/w7yIlW7PckWojQOa9efFqPxhf2s2BM4fDZXvUvCEIfRc5vzMx7yOPKUTw8B_DHdVetU8t80mjXt0IcM6yJJ0iGRjgEG2W3sSACUK0wtUlIbcAKIc-S0zWrDjJNdMGqRU9XV3cwisfUFLXTD4nWOImUlqcFFNwP1wKu4uAW2-NOB8KpmNL3Iz-YUi5MofCz8d?purpose=fullsize"
                ],
                topics: ["Pattern Recognition", "Mirror Image", "Paper Folding", "Figure Completion"]
            }
        ],
        examPattern: {
            totalQuestions: "15-20",
            type: "Multiple Choice Questions (MCQs)",
            difficulty: "Easy to Moderate"
        },
        notesLink: "/question-bank-reasoning.txt"
    },
    ta: {
        title: "Subject: Teaching Aptitude",
        subtitle: "Understand core teaching concepts, psychology, and classroom practices.",
        overview: "This section measures your teaching attitude, classroom awareness, and educational understanding.",
        sections: [
            {
                heading: "Teaching Fundamentals",
                notesLink: "/notes/ta-teaching-fundamentals.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/J1SjoP1GRatGoA_PRAzL3tDVTNfJXXbHcg7hPHScCH_6-gMhOsxUNjzj-oVs3SBIKWeTDXtL-x9VNXNbmbW173nUW4S-SWaHUaP0KW5R_xGYSgEKWzMMUL0lbyR30nVJXo6BFcbbWqcf2CkqlYHkyCZMzYTWX8wmUAJ53E3arn24S0mdIPOrM8xeVgOu1xbY?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/zxG_5zN3bDNohyvmujSzPreUsYAIYJRbZoek0RGGH8gSCQ-cqCmBwBhmo7-bzYWuxC3iIVMBXhNWfErE5AzcoCk04sgd66rSoevH1pO7asqRYhYyHJQ4XsLwTQJCI26ogl_KyquZ0yTu9w0dZ-GlfzqhnVBwl0HVMeqC6CDpFRfi2Mj9wAzCPxV6MjsV_Vou?purpose=fullsize"
                ],
                topics: ["Teaching Methods", "Learning Process", "Lesson Planning", "Classroom Communication"]
            },
            {
                heading: "Educational Psychology",
                notesLink: "/notes/ta-educational-psychology.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/3lXFYTwvQ8579XSgUYMTJu6Qt9Un-L61EhujTacN7XLev0nzse_w09aEKpVzcQIKcNrHS8Wu4p9WUyIXQAT06xeA4EIg3LQiC_RlDTLDnm5iDECEQwo3rAYq5OjPs-pyySaXYfZn1pcZKLm9k5l2AaQ646Ob-CDI2Hbnpwi1Bjef1XTuOEgOhQp1204HA3IW?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/oQNY7mDJuNC4oEXLIQx_tozG4sOfgzomUaDNRFIFh0aGnDB-aWK9lSAYdDLar9ZVTlR13BmGK2NZ9elPbFYaqdlmnq2TMmmI0Ch2QhKzzU_bGtI5aG3KrRiWKY65Z4GMX3POLJrknjOwGAGBFJJddMSrEv_xVJlaT7zw8QDD2MgVaV2-bT0TjAHEkmUkcCgL?purpose=fullsize"
                ],
                topics: ["Child Development", "Motivation", "Learning Theories", "Individual Differences"]
            },
            {
                heading: "Classroom Management",
                notesLink: "/notes/ta-classroom-management.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/JyJWlQzraS1dCE0VpzqNmxmLI3G4XBjOM7_92yMJqp1vO3dmgpcyLwsnBddq6XnDesbWdLDhg_LVwN2OtjT9lHgP9VQKTVjmxiQ5KAIJz3G8XMOAGG-96iwmyrsr4TKNTsDMrRJvFevnJUapd065GARjdG7vUZDF1IzCLvHViqLeFEh-lfaJIpjV-dQ60kIg?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/SGX1gXbyfPct1VRO6gsxntxROkB0TCwojnx5ZKSo720ZA2KI02k3rqt2bog9yuZDCgj6PmFz99WoVJQBTGXP_VRfGsAiSEu7sh4Yi_LGtFc7MrCWrW4FUQ6Pv-3R4Zvr9w7TZRFug9Uzu7UykJI2_UFKopCgJaoFY5tLRGUh1GksXYsfIMQEx6B8xkkxVrhR?purpose=fullsize"
                ],
                topics: ["Time Management", "Inclusive Practices", "Student Behavior", "Assessment Techniques"]
            }
        ],
        examPattern: {
            totalQuestions: "15-20",
            type: "Multiple Choice Questions (MCQs)",
            difficulty: "Easy to Moderate"
        },
        notesLink: "/question-bank-teaching-aptitude.txt"
    },
    language: {
        title: "Subject: Language (Hindi/English)",
        subtitle: "Sharpen grammar, vocabulary, and comprehension for B.Ed entrance.",
        overview: "This section checks your command over grammar, sentence usage, and reading comprehension.",
        sections: [
            {
                heading: "Grammar",
                notesLink: "/notes/language-grammar.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/ws8drbYScTmljThnuSlTzDGER82VZ37R7cd5lLOTHya5VzPb_xleA4ibAsUQnG57dW5mBmePcOunTU-D9hwXeuguRgIwakwcexqtOy57CjleLtNvZYKpw7uZhGLsfrQacIuNp5CXn9A44WNUc1gbawEZr-Gg5OaE45EkTbtZLOwlx5QDEZhzqc9J5Cxihehu?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/UXZvp0BassHzntyOU90rJ57hzR2UqDOFrSAD1-bUAoqOT59byKJOog82IgdcxdaIuO5_hjvKcLLIY5Xu9LbLTupG61dYxMqDjptcmVzGUX9onb5pW2avv-th4FYVc1817hvSFMaiw7jUos_oSHXRHMACzXNBbtIjUIDYyUXGjbLggfkONNYJi1F8cv8k6m3R?purpose=fullsize"
                ],
                topics: ["Parts of Speech", "Tenses", "Subject-Verb Agreement", "Sentence Transformation"]
            },
            {
                heading: "Vocabulary",
                notesLink: "/notes/language-vocabulary.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/09OYl-8vtR4Xp3aXAHp8IuniOg65IS0ODKAotklh4K9p7Z7r4NG3OjRjOENOvuBvwmSnwIHWsGiR4C84zCBWsnN52bn1FBVQvN4ogRKb5YmfwSfxAqC2FfXD26M5Rp75NX9omnWzEpHqp2SM-gZytaoGNnpSA4etprWwE0ItOx1hHRWUhvgR25Y7SSI-nV9K?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/bZt60yFk2HlEQM4dEipMK6emT8KlV7EupFgVlTpi0mEkpjvFts8lltM5qulmuYK85zOaC7SmPLV3MOxyGpSQ3gA0xdSqgijAY7fKpEal8ipmK8ODI19Da9CgNoqsRZwIunBCw29gzBd3Jbvw9qisxgDY3mz4YRsaerqXcwpqRqJ5YZlhJ_-ukC07iQ7WeWYr?purpose=fullsize"
                ],
                topics: ["Synonyms & Antonyms", "One Word Substitution", "Idioms and Phrases", "Word Usage"]
            },
            {
                heading: "Comprehension",
                notesLink: "/notes/language-comprehension.txt",
                images: [
                    "https://images.openai.com/static-rsc-4/L8GI_m0A_a6wHupPPKbsNqSp9lRlBxEud4nsTJ2st6JaD-ughpaQ7IeyX1t_wC57Od3bkWPQAN2lnC6xXo_q7xCB2VsFUb_pk4YKE0gC8hCz1bxgyd31dWSscZ49qGBuA-NttNldExdZFEJapByDxaf4UC4zSRSR5HwnoPntUzvNVzSre0BaFimKc5cXTIZh?purpose=fullsize",
                    "https://images.openai.com/static-rsc-4/TN3Cms00TzVQ1o3B1ty1Y_6kael9-mZmPGC8GELXnUgtI5eYAB1LBEfM6lNP22OxnZ5Xa7EjIWmnWc-_9SsZKEd0y5kNUddyHNyFnaYJrVpI4KPUkEegtQpRxo4FUjFSx9bbdvkRfMXEEDcxcF-lIs-Fw4u33xSXyo0lrsY0ic0PDWHuoXXX6Rqt07DTPZsX?purpose=fullsize"
                ],
                topics: ["Reading Comprehension", "Error Detection", "Sentence Improvement", "Cloze Test"]
            }
        ],
        examPattern: {
            totalQuestions: "15-20",
            type: "Multiple Choice Questions (MCQs)",
            difficulty: "Easy to Moderate"
        },
        notesLink: "/question-bank-language.txt"
    }
};

export const subjectTests = {
    gk: [
        { id: "gk-1", name: "Current Affairs Quiz", duration: "15 min", questions: 10 },
        { id: "gk-2", name: "History Basics", duration: "20 min", questions: 15 },
        { id: "gk-3", name: "Geography Test", duration: "18 min", questions: 12 }
    ],
    ta: [
        { id: "ta-1", name: "Teaching Methods", duration: "15 min", questions: 10 },
        { id: "ta-2", name: "Classroom Management", duration: "20 min", questions: 12 },
        { id: "ta-3", name: "Student Psychology", duration: "18 min", questions: 15 }
    ],
    reasoning: [
        { id: "r-1", name: "Series & Patterns", duration: "15 min", questions: 10 },
        { id: "r-2", name: "Logical Reasoning", duration: "20 min", questions: 15 },
        { id: "r-3", name: "Analogies", duration: "18 min", questions: 12 }
    ],
    language: [
        { id: "l-1", name: "Grammar Basics", duration: "15 min", questions: 10 },
        { id: "l-2", name: "Comprehension", duration: "25 min", questions: 15 },
        { id: "l-3", name: "Vocabulary & Synonyms", duration: "18 min", questions: 12 }
    ]
};
