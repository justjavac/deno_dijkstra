# deno_dijkstra

[![tag](https://img.shields.io/github/release/justjavac/deno_dijkstra)](https://github.com/justjavac/deno_dijkstra/releases)
[![ci](https://github.com/justjavac/deno_dijkstra/actions/workflows/ci.yml/badge.svg)](https://github.com/justjavac/deno_dijkstra/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/justjavac/deno_dijkstra)](https://github.com/justjavac/deno_dijkstra/blob/master/LICENSE)

A simple JavaScript implementation of Dijkstra's single-source shortest-paths
algorithm.

> Base on [tcort/dijkstrajs](https://github.com/tcort/dijkstrajs)

## Usage

```ts
import dijkstra from "https://deno.land/x/dijkstra/mod.ts";

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

const path = dijkstra.find_path(graph, "a", "i"); // ["a", "d", "e", "f", "i"]
```

## Example

```bash
deno run https://deno.land/x/dijkstra/example.ts
```

## License

[deno_dijkstra](https://github.com/justjavac/deno_dijkstra) is released under
the MIT License. See the bundled [LICENSE](./LICENSE) file for details.
