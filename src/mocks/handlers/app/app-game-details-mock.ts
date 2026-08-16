import { GameDetails } from "@/types/app/app-game-details-type";
import { MOCK_GAMES } from "./app-games-mock";
import { Question } from "@/types/app/app-questions-type";
import { http, HttpResponse } from "msw";
import { APP_GAME_DETAILS_API_URL } from "@/lib/urls";

export const MOCK_QUESTIONS: Question[][] = [

  [
    {
      id: 'q_mp1',
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
      id: 'q_mp2',
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
      id: 'q_mp3',
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

  [
    {
      id: 'q_mp4',
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
  [
    {
      id: 'q_mp5',
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
  [
    {
      id: 'q_mp6',
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
      id: 'q_e1',
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
]

export const MOCK_GAME_DETAILS: GameDetails[] = [
  {
    id: "g1",
    status: MOCK_GAMES[0].status,
    game: MOCK_GAMES[0],
    questions: MOCK_QUESTIONS[0],
    created_at: '2024-01-10'
  },
  {
    id: "g2",
    status: MOCK_GAMES[1].status,
    game: MOCK_GAMES[1],
    questions: MOCK_QUESTIONS[1],
    created_at: '2024-02-05'
  },
  {
    id: "g3",
    status: MOCK_GAMES[2].status,
    game: MOCK_GAMES[2],
    questions: MOCK_QUESTIONS[2],
    created_at: '2024-02-20'
  }
];

const db: GameDetails[] = [...MOCK_GAME_DETAILS];

export const appGamesDetailsHandlers = [

  http.get(`${APP_GAME_DETAILS_API_URL}`, ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);

    const items = [...db];

    const total = items.length;

    const start = (page - 1) * size;
    const end = start + size;

    return HttpResponse.json({
      data: items.slice(start, end),
      total,
    });
  }),

  // -------------------------
  // GET ONE
  // -------------------------

  http.get(`${APP_GAME_DETAILS_API_URL}/:id`, ({ params }) => {
    const item = db.find((g) => g.id === params.id);

    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ data: item });
  }),

  // -------------------------
  // CREATE
  // -------------------------

  http.post(`${APP_GAME_DETAILS_API_URL}/new`, async ({ request }) => {
    const body = (await request.json()) as GameDetails;

    const newGame: GameDetails = {
      ...body,
      id: `g_${Date.now()}`,
    };

    db.unshift(newGame);

    return HttpResponse.json({ data: newGame }, { status: 201 });
  }),

  // -------------------------
  // UPDATE
  // -------------------------
  http.put(`${APP_GAME_DETAILS_API_URL}/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Partial<GameDetails>;

    const index = db.findIndex((g) => g.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    db[index] = {
      ...db[index],
      ...body,
    };

    return HttpResponse.json({ data: db[index] });
  }),

  // -------------------------
  // DELETE
  // -------------------------

  http.delete(`${APP_GAME_DETAILS_API_URL}/:id`, async ({ params }) => {

    const index = db.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const deleted = db.splice(index, 1);

    return HttpResponse.json({ data: deleted[0] });

  })

];