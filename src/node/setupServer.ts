import { RequestHandler } from "msw";
import { ClientRequestInterceptor } from "@mswjs/interceptors/ClientRequest";
import { XMLHttpRequestInterceptor } from "@mswjs/interceptors/XMLHttpRequest";
import { FetchInterceptor } from "@mswjs/interceptors/fetch";
import { type CreateMockReturnType } from "../createMock/createMock";
import SetupServerApi from "./SetupServerApi";
import { CreateScenarioReturnType } from "../createScenario/createScenario";

export default function setupServer(
  ...handlers: Array<
    RequestHandler | CreateMockReturnType | CreateScenarioReturnType
  >
) {
  return new SetupServerApi(
    [ClientRequestInterceptor, XMLHttpRequestInterceptor, FetchInterceptor],
    ...handlers
  );
}
