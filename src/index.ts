import { serverPort } from "./config";
import app from "./routes/app";

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
