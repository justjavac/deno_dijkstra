import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.68.0/testing/asserts.ts";

import dijkstra from "./mod.ts";

const { find_path } = dijkstra;

Deno.test("should find all paths from a node", function () {
  const graph = {
    a: { b: 10, c: 100, d: 1 },
    b: { c: 10 },
    d: { b: 1, e: 1 },
    e: { f: 1 },
    f: { c: 1 },
    g: { b: 1 },
  };

  // All paths from 'a'
  const paths = dijkstra.single_source_shortest_paths(graph, "a");
  assertEquals(paths, {
    d: "a",
    b: "d",
    e: "d",
    f: "e",
    c: "f",
  });
});

Deno.test("should find the path between two points, all edges have weight 1", function () {
  // A B C
  // D E F
  // G H I
  const graph = {
    a: { b: 10, d: 1 },
    b: { a: 1, c: 1, e: 1 },
    c: { b: 1, f: 1 },
    d: { a: 1, e: 1, g: 1 },
    e: { b: 1, d: 1, f: 1, h: 1 },
    f: { c: 1, e: 1, i: 1 },
    g: { d: 1, h: 1 },
    h: { e: 1, g: 1, i: 1 },
    i: { f: 1, h: 1 },
  };
  const path = find_path(graph, "a", "i");
  assertEquals(path, ["a", "d", "e", "f", "i"]);
});

Deno.test("should find the path between two points, weighted edges", function () {
  const graph = {
    a: { b: 10, c: 100, d: 1 },
    b: { c: 10 },
    d: { b: 1, e: 1 },
    e: { f: 1 },
    f: { c: 1 },
    g: { b: 1 },
  };

  let path = find_path(graph, "a", "c");
  assertEquals(path, ["a", "d", "e", "f", "c"]);
  path = find_path(graph, "d", "b");
  assertEquals(path, ["d", "b"]);
});

Deno.test("should throw on unreachable destination", function () {
  const graph = {
    a: { b: 10, c: 100, d: 1 },
    b: { c: 10 },
    d: { b: 1, e: 1 },
    e: { f: 1 },
    f: { c: 1 },
    g: { b: 1 },
  };

  assertThrows(function () {
    find_path(graph, "c", "a");
  });
  assertThrows(function () {
    find_path(graph, "a", "g");
  });
});

Deno.test("should throw on non-existent destination", function () {
  const graph = {
    a: { b: 10, c: 100, d: 1 },
    b: { c: 10 },
    d: { b: 1, e: 1 },
    e: { f: 1 },
    f: { c: 1 },
    g: { b: 1 },
  };

  assertThrows(function () {
    find_path(graph, "a", "z");
  });
});
