import { testMock } from "../createMock/createMock.test-d";
import createScenario from "./createScenario";

const testScenario = createScenario({
  key: "testScenario",
  mocks: [testMock],
});

testScenario.updateParameters({
  testKey: {
    boolean: true,
    //@ts-expect-error not a valid parameter
    notExist: false,
  },
});
