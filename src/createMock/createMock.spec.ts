import { expect, test, afterEach } from "vitest";
import setupServer from "../node/setupServer";
import createMock from "./createMock";
import { HttpResponse, http } from "msw";

const testMock = createMock(
  {
    key: "testMock",
    parameters: {
      string: "test-string",
      number: 1,
      boolean: true,
      nullableStringWithoutDefault: {
        dashboardInputType: "string",
        nullable: true,
      },
      stringWithInputTypeAndDefaultValue: {
        dashboardInputType: "string",
        defaultValue: "test-string-default-value",
      },
      selectOptions: {
        selectOptions: ["test", true, "true"],
        // TODO: check type for default value
        defaultValue: "no",
      },
    },
  },
  (parameters) => {
    return [
      http.get("http://localhost/some-get", () => {
        return HttpResponse.json(parameters);
      }),
      http.get(
        "http://localhost/get-once-dynamic",
        () => {
          return HttpResponse.json({ onceResponse: true });
        },
        { once: true }
      ),
    ];
  }
);

const initialParameters = {
  string: "test-string",
  number: 1,
  boolean: true,
  nullableStringWithoutDefault: null,
  selectOptions: "no",
  stringWithInputTypeAndDefaultValue: "test-string-default-value",
};

const server = setupServer(
  testMock,
  http.get(
    "http://localhost/get-once",
    () => {
      return HttpResponse.json({ onceResponseNonDynamic: true });
    },
    { once: true }
  )
);
server.listen();

afterEach(() => {
  server.resetHandlers();
});

test("Updates dynamic mocks and resets properly", async () => {
  expect(
    await fetch("http://localhost/some-get").then((res) => res.json())
  ).toEqual(initialParameters);
  const updatedString = "updated-string";
  testMock.updateParameters({ string: updatedString });
  expect(
    await fetch("http://localhost/some-get").then((res) => res.json())
  ).toEqual({ ...initialParameters, string: updatedString });
  server.resetHandlers();
  expect(
    await fetch("http://localhost/some-get").then((res) => res.json())
  ).toEqual(initialParameters);
  testMock.updateParameters({ string: updatedString });
  expect(
    await fetch("http://localhost/some-get").then((res) => res.json())
  ).toEqual({ ...initialParameters, string: updatedString });
  testMock.reset();
  expect(
    await fetch("http://localhost/some-get").then((res) => res.json())
  ).toEqual(initialParameters);
});

test("Does not consider an previously called HttpResponse called after updating paramaters", async () => {
  expect(
    await fetch("http://localhost/get-once-dynamic").then((res) => res.json())
  ).toEqual({ onceResponse: true });
  const updatedString = "updated-string";
  testMock.updateParameters({ string: updatedString });
  expect(
    fetch("http://localhost/get-once-dynamic").then((res) => res.json())
  ).rejects.toThrow();
});

test("Considers an non-dynamic and dynamic HttpResponse un-called after `server.resetHandlers` is called", async () => {
  expect(
    await fetch("http://localhost/get-once-dynamic").then((res) => res.json())
  ).toEqual({ onceResponse: true });
  expect(
    await fetch("http://localhost/get-once").then((res) => res.json())
  ).toEqual({ onceResponseNonDynamic: true });
  server.resetHandlers();
  expect(
    await fetch("http://localhost/get-once-dynamic").then((res) => res.json())
  ).toEqual({ onceResponse: true });
  expect(
    await fetch("http://localhost/get-once").then((res) => res.json())
  ).toEqual({ onceResponseNonDynamic: true });
});
