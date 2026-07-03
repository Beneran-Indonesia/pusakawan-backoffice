import { GameDetails } from "@/types/app/game-details";


const MOCK_GAMES: GameDetails[] = [
    {
        game: {
            id: 'g1',
            title: 'Indonesian Heritage Challenge',
            is_offline: true,
            status: 'published',
            banner: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop',
            description: 'An exciting offline game that tests your knowledge about Indonesian culture, history, and traditions. Perfect for educational events and community gatherings.',
            rules: [
                'Players must answer all questions in order',
                'Each correct answer earns Pusaka Points',
                'Time limit applies to each question',
                'No external help or internet search allowed',
                'Have fun and learn about Indonesia!'
            ],
            held_on: {
                start_date: new Date('2026-03-15'),
                end_date: new Date('2026-03-17')
            },
            is_linear_flow: true,
            is_correct_authentication: true,
            time_range: {
                start_time: new Date('09:00'),
                end_time: new Date('17:00')
            },
            is_automatic_start: true,
            diversity_points: true,
            group_size: {
                minimum_participants: 10,
                maximum_participants: 100
            }
        },
        questions: [
            {
                id: 'q1',
                is_essay_question: false,
                question: 'What is the capital city of Indonesia?',
                media: {
                    id: 'media-q1',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1751953813464-06a989a71c3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWthcnRhJTIwc2t5bGluZSUyMG1vbmFzfGVufDF8fHx8MTc3MjYwOTA4MHww&ixlib=rb-4.1.0&q=80&w=1080',
                    file_name: 'jakarta-skyline.jpg',
                    file_size: 245678
                },
                options: {
                    a: 'Bandung',
                    b: 'Jakarta',
                    c: 'Surabaya',
                    d: 'Medan'
                },
                correct_answer: 'b',
                pusaka_points: 10,
                incorrect_validation: 'Oops! That\'s not correct. Try again!',
                correct_validation: 'Great job! Jakarta is indeed the capital!'
            },
            {
                id: 'q2',
                is_essay_question: false,
                question: 'Which of these is a traditional Indonesian instrument?',
                media: {
                    id: 'media-q2',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1668603090281-467a53e0aafa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lbGFuJTIwdHJhZGl0aW9uYWwlMjBpbnN0cnVtZW50fGVufDF8fHx8MTc3MjYwOTA4MHww&ixlib=rb-4.1.0&q=80&w=1080',
                    file_name: 'gamelan-instrument.jpg',
                    file_size: 312456
                },
                options: {
                    a: 'Piano',
                    b: 'Guitar',
                    c: 'Gamelan',
                    d: 'Violin'
                },
                correct_answer: 'c',
                pusaka_points: 15,
                incorrect_validation: 'Not quite right. Think about traditional music!',
                correct_validation: 'Excellent! Gamelan is a beautiful traditional instrument!'
            },
            {
                id: 'q3',
                is_essay_question: true,
                question: 'Name the national flower of Indonesia.',
                media: {
                    id: 'media-q3',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1655336653320-e2ba6546d198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXNtaW5lJTIwZmxvd2VyJTIwd2hpdGV8ZW58MXx8fHwxNzcyNjA5MDgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
                    file_name: 'jasmine-flower.jpg',
                    file_size: 189234
                },
                correct_answers: ['Melati', 'Jasmine', 'Melati Putih'],
                hints: [
                    'It is a white flower with a sweet fragrance',
                    'Commonly used in traditional ceremonies',
                    'The name starts with letter M'
                ],
                pusaka_points: 20,
                incorrect_validation: 'Incorrect answer. Think about white flowers!',
                correct_validation: 'Perfect! Melati (Jasmine) is our national flower!'
            }
        ],
        created_at: new Date('2024-01-10')
    },
    {
        game: {
            id: 'g2',
            title: 'Pancasila Values Quiz',
            is_offline: true,
            status: 'published',
            banner: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
            description: 'Test your understanding of Pancasila, the philosophical foundation of Indonesia. This game helps participants learn and internalize the five principles of Pancasila.',
            rules: [
                'Answer all questions honestly',
                'Each question has one correct answer',
                'Points are awarded for correct answers',
                'Learn from wrong answers'
            ],
            held_on: {
                start_date: new Date('2026-03-20'),
                end_date: new Date('2026-03-22')
            },
            is_linear_flow: false,
            is_correct_authentication: true,
            time_range: {
                start_time: new Date('10:00'),
                end_time: new Date('16:00')
            },
            is_automatic_start: false,
            diversity_points: false,
            group_size: {
                minimum_participants: 5,
                maximum_participants: 50
            }
        },
        questions: [
            {
                id: 'q1',
                is_essay_question: false,
                question: 'How many principles are in Pancasila?',
                
                options: {
                    a: '3',
                    b: '4',
                    c: '5',
                    d: '6'
                },
                correct_answer: 'c',
                pusaka_points: 10,
                incorrect_validation: 'That\'s not right. Count again!',
                correct_validation: 'Correct! Pancasila has 5 principles!'
            }
        ],
        created_at: new Date('2024-02-05')
    },
    {
        game: {
            id: 'g3',
            title: 'Explore Nusantara',
            is_offline: true,
            status: 'published',
            banner: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop',
            description: 'Journey through the Indonesian archipelago and discover the diverse cultures, languages, and traditions across different islands.',
            rules: [
                'Explore all regions sequentially',
                'Complete challenges to unlock new areas',
                'Answer questions about local culture',
                'Collect points from each island',
                'Team collaboration is encouraged'
            ],
            held_on: {
                start_date: new Date('2026-04-01'),
                end_date: new Date('2026-04-05')
            },
            is_linear_flow: true,
            is_correct_authentication: true,
            time_range: {
                start_time: new Date('08:00'),
                end_time: new Date('18:00')
            },
            is_automatic_start: true,
            diversity_points: true,
            group_size: {
                minimum_participants: 15,
                maximum_participants: 200
            }
        },
        questions: [
            {
                id: 'q1',
                is_essay_question: false,
                question: 'Which island is known as the "Island of Gods"?',
                options: {
                    a: 'Java',
                    b: 'Bali',
                    c: 'Sumatra',
                    d: 'Sulawesi'
                },
                correct_answer: 'b',
                pusaka_points: 15,
                incorrect_validation: 'Not quite! Think about Hindu temples and ceremonies.',
                correct_validation: 'Correct! Bali is known as the Island of Gods!'
            },
            {
                id: 'q2',
                is_essay_question: true,
                question: 'Name the largest island in Indonesia.',
                correct_answers: ['Papua', 'Irian Jaya', 'Papua Island'],
                hints: [
                    'Located in the eastern part of Indonesia',
                    'It shares borders with another country',
                    'Known for its unique wildlife and indigenous tribes'
                ],
                pusaka_points: 20,
                incorrect_validation: 'Incorrect. Think about the eastern part of Indonesia!',
                correct_validation: 'Excellent! Papua is indeed the largest island!'
            }
        ],
        created_at: new Date('2024-02-20')
    }
];