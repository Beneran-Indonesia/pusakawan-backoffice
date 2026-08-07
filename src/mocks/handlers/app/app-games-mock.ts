import { APP_GAMES_API_URL } from "@/lib/urls";
import { Game } from "@/types/app/app-games-type";
import { http, HttpResponse } from "msw";

export const MOCK_GAMES: Game[] = [
  {
    id: "g1",
    title: "Indonesian Heritage Challenge",
    is_offline: true,
    status: "published",
    banner:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop",
    description:
      "An exciting offline game that tests your knowledge about Indonesian culture, history, and traditions. Perfect for educational events and community gatherings.",
    rules: [
      "Players must answer all questions in order",
      "Each correct answer earns Pusaka Points",
      "Time limit applies to each question",
      "No external help or internet search allowed",
      "Have fun and learn about Indonesia!",
    ],
    held_on: {
      start_datetime: "2026-03-15T09:00",
      end_datetime: "2026-03-17T19:00",
    },
    is_linear_flow: true,
    is_correct_authentication: true,
    is_automatic_start: true,
    diversity_points: true,
    group_size: {
      minimum_participants: 10,
      maximum_participants: 100,
    },
  },
  {
    id: "g2",
    title: "Pancasila Values Quiz",
    is_offline: true,
    status: "published",
    banner:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop",
    description:
      "Test your understanding of Pancasila, the philosophical foundation of Indonesia. This game helps participants learn and internalize the five principles of Pancasila.",
    rules: [
      "Answer all questions honestly",
      "Each question has one correct answer",
      "Points are awarded for correct answers",
      "Learn from wrong answers",
    ],
    held_on: {
      start_datetime: "2026-03-20T09:00",
      end_datetime: "2026-03-22T19:00",
    },
    is_linear_flow: false,
    is_correct_authentication: true,

    is_automatic_start: false,
    diversity_points: false,
    group_size: {
      minimum_participants: 5,
      maximum_participants: 50,
    },
  },
  {
    id: "g3",
    title: "Explore Nusantara",
    is_offline: true,
    status: "published",
    banner:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop",
    description:
      "Journey through the Indonesian archipelago and discover the diverse cultures, languages, and traditions across different islands.",
    rules: [
      "Explore all regions sequentially",
      "Complete challenges to unlock new areas",
      "Answer questions about local culture",
      "Collect points from each island",
      "Team collaboration is encouraged",
    ],
    held_on: {
      start_datetime: "2026-04-01T09:00",
      end_datetime: "2026-04-05T19:00",
    },
    is_linear_flow: true,
    is_correct_authentication: true,
    is_automatic_start: true,
    diversity_points: true,
    group_size: {
      minimum_participants: 15,
      maximum_participants: 200,
    },
  },
];

const db: Game[] = [...MOCK_GAMES];

// -------------------------
// GET LIST
// -------------------------
export const appGamesHandlers = [
  http.get(`${APP_GAMES_API_URL}`, ({ request }) => {
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

  http.get(`${APP_GAMES_API_URL}/:id`, ({ params }) => {
    const item = db.find((g) => g.id === params.id);

    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      data: {
        id: item.id,
        game: item,
        status: item.status,
        questions: [],
        created_at: new Date().toISOString(),
      },
    });
  }),

  // -------------------------
  // CREATE
  // -------------------------

  http.post(`${APP_GAMES_API_URL}`, async ({ request }) => {
    const body = (await request.json()) as Game;

    const newGame: Game = {
      ...body,
      id: `g_${Date.now()}`,
    };

    db.unshift(newGame);

    return HttpResponse.json({ data: newGame }, { status: 201 });
  }),

  // -------------------------
  // UPDATE
  // -------------------------
  http.put(`${APP_GAMES_API_URL}/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Partial<Game> & {
      game?: Partial<Game>;
      status?: Game["status"];
    };

    const index = db.findIndex((g) => g.id === params.id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const { game: nestedGame, status, ...flatRest } = body;

    db[index] = {
      ...db[index],
      ...flatRest,
      ...(nestedGame ?? {}),
      ...(status ? { status } : {}),
    };

    return HttpResponse.json({ data: db[index] });
  }),
];
