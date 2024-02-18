import SetupWorkerApi from "./SetupWorkerApi";
import { AllHandlerTypes } from "../types/AllHandlerTypes";

export default function setupWorker(...handlers: Array<AllHandlerTypes>) {
  return new SetupWorkerApi(false, handlers);
}
