const request = require("supertest");
const app = require("../app"); // adjust path if needed

describe("Task API Integration Tests", () => {

  // 1. Health Check
  test("1. GET /health should return 200 and status UP", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "UP");
    expect(res.body).toHaveProperty("timestamp");
  });

  // 2. GET All Tasks
  test("2. GET /api/tasks should return all tasks", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  // 3. GET Single Task (Valid)
  test("3. GET /api/tasks/:id should return a task", async () => {
    const res = await request(app).get("/api/tasks/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title");
  });

  // 4. GET Single Task (Invalid ID format)
  test("4. GET /api/tasks/:id with invalid ID should return 400", async () => {
    const res = await request(app).get("/api/tasks/abc");

    expect(res.statusCode).toBe(400);
  });

  // 5. GET Single Task (Not found)
  test("5. GET /api/tasks/:id with non-existing ID should return 404", async () => {
    const res = await request(app).get("/api/tasks/999");

    expect(res.statusCode).toBe(404);
  });

  // 6. POST Create Task (Valid)
  test("6. POST /api/tasks should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "New Task from Test" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "New Task from Test");
    expect(res.body).toHaveProperty("id");
  });

  // 7. POST Create Task (Invalid - empty title)
  test("7. POST /api/tasks without title should return 400", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  // 8. DELETE Task (Valid)
  test("8. DELETE /api/tasks/:id should delete a task", async () => {
    // First create a task to ensure it exists
    const createRes = await request(app)
      .post("/api/tasks")
      .send({ title: "Task to delete" });

    const taskId = createRes.body.id;

    const res = await request(app).delete(`/api/tasks/${taskId}`);

    expect(res.statusCode).toBe(204);
  });

  // 9. DELETE Task (Not found)
  test("9. DELETE /api/tasks/:id with invalid ID should return 404", async () => {
    const res = await request(app).delete("/api/tasks/9999");

    expect(res.statusCode).toBe(404);
  });

  // 10. Headers check
  test("10. Response should have JSON content-type", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.headers["content-type"]).toMatch(/json/);
  });

});
