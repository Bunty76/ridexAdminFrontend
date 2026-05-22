import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL;

export const handlers = [
  http.post(`${API_URL}/admin/login`, async ({ request }) => {
    const { email } = await request.json();
    if (email === "admin@ridex.com") {
      return HttpResponse.json({
        _id: "admin_1",
        name: "Super Admin",
        email: "admin@ridex.com",
        token: "mock_token",
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.get(`${API_URL}/drivers`, () => {
    return HttpResponse.json([
      {
        _id: "d1",
        name: "John Doe",
        status: "online",
        isApproved: true,
        phone: "1234567890",
      },
      {
        _id: "d2",
        name: "Jane Smith",
        status: "offline",
        isApproved: false,
        phone: "0987654321",
      },
    ]);
  }),

  http.get(`${API_URL}/trips`, () => {
    return HttpResponse.json([
      {
        _id: "t1",
        customerName: "Alice",
        pickup: "A",
        destination: "B",
        status: "completed",
        fare: "10",
      },
    ]);
  }),
];
