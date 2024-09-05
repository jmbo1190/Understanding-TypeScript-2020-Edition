import express from "express";
import todosRouter from "./routes/todos-routes";

const app = express();

// Todos Routes
app.use("/todos", todosRouter);

// Error-handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(3000);
