/** ****************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ****************************************************************************/

type GraphItem = Record<string, number>;
type Graph = Record<string, GraphItem>;

interface Item {
  cost: number;
  value: string;
}

/** A simple JavaScript implementation of Dijkstra's single-source shortest-paths algorithm. */
const dijkstra = {
  single_source_shortest_paths(
    graph: Graph,
    s: string,
    d?: string,
  ): Record<string, string> {
    // Predecessor map for each node that has been encountered.
    // node ID => predecessor node ID
    const predecessors: Record<string, string> = {};

    // Costs of shortest paths from s to all nodes encountered.
    // node ID => cost
    const costs: Record<string, number> = {};
    costs[s] = 0;

    // Costs of shortest paths from s to all nodes encountered; differs from
    // `costs` in that it provides easy access to the node that currently has
    // the known shortest path from s.
    // XXX: Do we actually need both `costs` and `open`?
    const open = dijkstra.MinPriorityQueue;
    open.push(s, 0);

    let closest: Item;
    let u: string;
    let v: string;
    let cost_of_s_to_u: number;
    let adjacent_nodes: Record<string, number>;
    let cost_of_e: number;
    let cost_of_s_to_u_plus_cost_of_e: number;
    let cost_of_s_to_v: number;
    let first_visit: boolean;

    while (!open.empty()) {
      // In the nodes remaining in graph that have a known cost from s,
      // find the node, u, that currently has the shortest path from s.
      closest = open.pop()!;
      u = closest.value;
      cost_of_s_to_u = closest.cost;

      // Get nodes adjacent to u...
      adjacent_nodes = graph[u] || {};

      // ...and explore the edges that connect u to those nodes, updating
      // the cost of the shortest paths to any or all of those nodes as
      // necessary. v is the node across the current edge from u.
      for (v in adjacent_nodes) {
        if (Object.prototype.hasOwnProperty.call(adjacent_nodes, v)) {
          // Get the cost of the edge running from u to v.
          cost_of_e = adjacent_nodes[v];

          // Cost of s to u plus the cost of u to v across e--this is *a*
          // cost from s to v that may or may not be less than the current
          // known cost to v.
          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

          // If we haven't visited v yet OR if the current known cost from s to
          // v is greater than the new cost we just found (cost of s to u plus
          // cost of u to v across e), update v's cost in the cost list and
          // update v's predecessor in the predecessor list (it's now u).
          cost_of_s_to_v = costs[v];
          first_visit = typeof costs[v] === "undefined";
          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
            costs[v] = cost_of_s_to_u_plus_cost_of_e;
            open.push(v, cost_of_s_to_u_plus_cost_of_e);
            predecessors[v] = u;
          }
        }
      }
    }

    if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
      const msg = ["Could not find a path from ", s, " to ", d, "."].join("");
      throw new Error(msg);
    }

    return predecessors;
  },

  extract_shortest_path_from_predecessor_list: function (
    predecessors: Record<string, string>,
    d: string,
  ): string[] {
    const nodes: string[] = [];
    let u: string = d;
    while (u) {
      nodes.push(u);
      u = predecessors[u];
    }
    nodes.reverse();
    return nodes;
  },

  find_path: function (graph: Graph, s: string, d: string): string[] {
    const predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
    return dijkstra.extract_shortest_path_from_predecessor_list(
      predecessors,
      d,
    );
  },

  /**
   * A priority queue implementation.
   */
  MinPriorityQueue: {
    queue: [] as Item[],

    sorter(a: { cost: number }, b: { cost: number }): number {
      return a.cost - b.cost;
    },

    /**
     * Add a new item to the queue and ensure the highest priority element
     * is at the front of the queue.
     */
    push(value: string, cost: number) {
      const item = { value: value, cost: cost };
      const length = this.queue.length;
      this.queue.push(item);
      this.swim(length);
    },

    parent(i: number): number {
      return Math.floor((i - 1) / 2);
    },

    left(i: number): number {
      return i * 2 + 1;
    },

    right(i: number): number {
      return i * 2 + 2;
    },

    swim(i: number) {
      const queue = this.queue;
      while (i > 0) {
        const pi = this.parent(i);
        if (this.sorter(queue[i], queue[pi]) >= 0) {
          break;
        }
        this.swap(pi, i);
        i = pi;
      }
    },

    sink(i: number) {
      const queue = this.queue;
      // left child index in queue
      const li = this.left(i);
      while (li < queue.length) {
        // current biggest_priority index of data from cur , left child and right child;
        let bi = i;
        if (this.sorter(queue[li], queue[bi]) > 0) {
          bi = li;
        }
        // right child index of i
        const ri = this.right(i);
        if (ri < queue.length && this.sorter(queue[ri], queue[bi]) > 0) {
          bi = ri;
        }
        if (bi === i) {
          break;
        }
        this.swap(bi, i);
        i = bi;
      }
    },

    swap(i: number, j: number) {
      const tem = this.queue[i];
      this.queue[i] = this.queue[j];
      this.queue[j] = tem;
    },
    /**
     * Return the highest priority element in the queue.
     * caller should guarantee current queue is not empty
     */
    pop() {
      this.swap(0, this.queue.length - 1);
      const item = this.queue.pop();
      this.sink(0);
      return item;
    },

    empty(): boolean {
      return this.queue.length === 0;
    },
  },
};

export default dijkstra;
