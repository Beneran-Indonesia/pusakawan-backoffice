import { Post } from "@/types/app/app-home-type";
import { http, HttpResponse } from "msw";
import { APP_HOME_API_URL } from "@/lib/urls";

const MOCK_HOME: Post[] = [
  {
    id: "h1",
    author: "Pusakawan Team",
    pictures: [
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
    ],
    description:
      "Welcome to the Pusakawan learning app! We hope you are all excited to learn today.",
    timestamp: "2 hours ago",
    status: "published",
  },
  {
    id: "h2",
    author: "Pusakawan Team",
    pictures: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop",
    ],
    description:
      "Join us for an exciting workshop this weekend! Learn new skills and meet fellow students.",
    timestamp: "1 day ago",
    status: "draft",
  },
  {
    id: "h3",
    author: "Pusakawan Team",
    pictures: [
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop",
    ],
    description:
      "Congratulations to all students who completed the Indonesian Heritage Challenge! Your dedication is inspiring.",
    timestamp: "3 days ago",
    status: "published",
  },
];

const db = [...MOCK_HOME];

const parseUrl = (url: URL) => {
  const page = Number(url.searchParams.get("page") ?? 1);
  const size = Number(url.searchParams.get("size") ?? 10);
  const status = url.searchParams.get("status");

  return { page, size, status };
};

export const appHomeHandlers = [
  // -------------------------
  // GET LIST
  // -------------------------
  http.get(`${APP_HOME_API_URL}`, ({ request }) => {
    const url = new URL(request.url);
    const { page, size, status } = parseUrl(url);

    let items = [...db];

    if (status && status !== "ALL") {
      items = items.filter((p) => p.status === status.toLowerCase());
    }

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
  http.get(`${APP_HOME_API_URL}/:id`, ({ params }) => {
    const { id } = params;

    const item = db.find((p) => p.id === id);

    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ data: item });
  }),

  // -------------------------
  // CREATE
  // -------------------------
  http.post(`${APP_HOME_API_URL}`, async ({ request }) => {
    const body = (await request.json()) as Post;

    const newItem: Post = {
      ...body,
      id: `h_${Date.now()}`,
    };

    db.unshift(newItem);

    return HttpResponse.json({ data: newItem }, { status: 201 });
  }),

  // -------------------------
  // UPDATE
  // -------------------------
  http.put(`${APP_HOME_API_URL}/:id`, async ({ request, params }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Post>;

    const index = db.findIndex((p) => p.id === id);

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
  http.delete(`${APP_HOME_API_URL}/:id`, ({ params }) => {
    const { id } = params;

    const index = db.findIndex((p) => p.id === id);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const deleted = db.splice(index, 1);

    return HttpResponse.json({ data: deleted[0] });
  }),
];
