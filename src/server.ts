import { App } from "./app";

const PORT = Number(process.env.PORT);

const application = new App(PORT);

application.start();

export default application.app;