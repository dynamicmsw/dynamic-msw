export default function assertEntity(entity?: unknown): asserts entity {
  if (!entity)
    throw Error(
      "Entity does not exist. Ensure you pass the mock or scenario to the `setupDashboard` or `setupHandlers` function before calling any of it's methods.",
    );
}
