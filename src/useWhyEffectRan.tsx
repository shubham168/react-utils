import { DependencyList, useEffect, useRef } from "react";

type DependencyChanges = Record<
  string,
  {
    from: unknown;
    to: unknown;
  }
>;

export function useWhyEffectRan(
  dependencies: DependencyList,
  dependencyNames: readonly string[] = [],
): void {
  const previousDeps = useRef<DependencyList>(dependencies);

  useEffect(() => {
    const changes: DependencyChanges = {};

    dependencies.forEach((dep: any, index: any) => {
      const previousValue = previousDeps.current[index];

      if (!Object.is(dep, previousValue)) {
        changes[dependencyNames[index] ?? String(index)] = {
          from: previousValue,
          to: dep,
        };
      }
    });

    if (Object.keys(changes).length > 0) {
      console.group("useEffect re-ran because:");
      console.table(changes);
      console.groupEnd();
    }

    previousDeps.current = dependencies;
  });
}
