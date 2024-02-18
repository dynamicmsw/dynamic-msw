import SetupWorkerApi from "./SetupWorkerApi";
import { AllHandlerTypes } from "../types/AllHandlerTypes";

export default function setupDashboard(...handlers: Array<AllHandlerTypes>) {
  return new SetupWorkerApi(true, handlers);
}
