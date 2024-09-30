const E = [];
class l extends HTMLElement {
  static onElementRemoved = /* @__PURE__ */ new Map();
  static elementsToTheLeftOf = /* @__PURE__ */ new Map();
  static elementsToTheRightOf = /* @__PURE__ */ new Map();
  static intersectionObserver = new IntersectionObserver(
    (n) => n.forEach(
      ({ target: t, boundingClientRect: c }) => l.findAdjacentElements(t, c)
    ),
    // Notify at every 1% change in intersection ratio
    { threshold: P(100) }
  );
  static findAdjacentElements(n, t) {
    const c = +n.dataset.spanRows, r = +n.dataset.spanColumns, { height: i, width: g } = t, T = i / c, w = g / r, L = i - T + T / 2, d = t.top + L, O = innerHeight;
    if (!(d >= 0 && d <= O || t.bottom >= 0 && t.bottom <= O)) return;
    const R = new Set(n.parentElement.parentElement.children), m = t.left - w / 2, a = t.right + w / 2, o = Math.max(d, 0), s = (b) => R.has(b), u = document.elementsFromPoint(m, o).find(s), v = document.elementsFromPoint(a, o).find(s), [, f] = l.elementsToTheLeftOf.get(n), [, x] = l.elementsToTheRightOf.get(n);
    x(v), f(u);
  }
  // Use custom elements to hook into the lifecycle of one of our content block elements being in the DOM.
  connectedCallback() {
    const { intersectionObserver: n, onElementRemoved: t, elementsToTheLeftOf: c, elementsToTheRightOf: r } = l, i = h(void 0), g = h(void 0), [T] = i, [w] = g;
    c.set(this, i), r.set(this, g);
    const L = H(() => {
      const d = I(() => (F(), C(T()))), O = I(() => (F(), C(w()))), p = I(() => {
        const a = d()(), o = O()();
        return Math.min(a ?? 1 / 0, o ?? 1 / 0);
      }), R = I(() => {
        const a = z().get(p());
        return a ? a.values().next().value?.topPadding ?? 0 : 0;
      }), m = I(() => {
        const a = z().get(p());
        if (!a) return 0;
        const o = a.values().next().value;
        let s;
        return o ? s = o.bottomPadding : s = p(), s === 1 / 0 ? 0 : s;
      });
      H(() => this.style.setProperty("--bottom-alignment-spacing", `${m()}px`)), H(() => this.style.setProperty("--top-alignment-spacing", `${R()}px`)), y((a) => a.set(this, p)), S(
        () => y((a) => (a.delete(this), a))
      );
    });
    n.observe(this), t.set(this, [
      // We need to clean up the top-level effect, but child-effects will be cleaned up automatically (there's no createRoot in the simple reactive library)
      L,
      () => {
        n.unobserve(this), t.delete(this), c.delete(this), r.delete(this);
      }
    ]);
  }
  disconnectedCallback() {
    l.onElementRemoved.get(this).forEach((n) => n());
  }
}
const [F, M] = h(!1), [q, y] = h(/* @__PURE__ */ new Map(), !1), [z, A] = h(
  /* @__PURE__ */ new Map(),
  !1
);
customElements.define("depict-block-media", l);
const j = new ResizeObserver(() => {
  for (const e of l.elementsToTheLeftOf.keys())
    l.findAdjacentElements(e, e.getBoundingClientRect());
});
j.observe(document.documentElement);
j.observe(document.body);
addEventListener("DOMContentLoaded", () => M((e) => !e));
addEventListener("load", () => M((e) => !e));
function C(e) {
  if (e?.matches(".depict-content-block")) {
    const o = e.querySelector("depict-block-media");
    return () => q().get(o)?.();
  }
  const n = e?.querySelectorAll("img"), t = (o) => {
    if (!(!o || !n)) {
      for (const s of n)
        if (k(o, s.src) || k(o, s.srcset) || k(o, s.dataset.src))
          return s;
    }
  }, c = t(e?.dataset?.defaultImage), r = t(e?.dataset?.hoverImage);
  if (!e || !c && !r)
    return () => {
    };
  let i = !1;
  const [g, T] = h(0), [w, L] = h(0), [d, O] = h(0), [p, R] = h(0), m = new ResizeObserver((o) => {
    for (const {
      target: s,
      contentRect: { height: u }
    } of o)
      s === e ? T(u) : s === c ? L(u) : s === r && O(u), i || (i = !0, queueMicrotask(() => {
        const f = (e.childElementCount === 1 ? e.firstElementChild : e).getBoundingClientRect(), b = (d() && r ? r : c).getBoundingClientRect();
        if (b.width && b.height && f.width && f.height) {
          const U = b.top - f.top;
          R(U);
        } else
          R(0);
        i = !1;
      }));
  });
  S(() => m.disconnect()), c && m.observe(c), r && m.observe(r), m.observe(e);
  const a = I(() => {
    const o = g(), s = w() || d();
    if (o && s)
      return o - s;
  });
  return H(() => {
    const o = p(), s = a();
    if (s == null) return;
    const u = { topPadding: o, bottomPadding: s - o };
    A((v) => {
      let f = v.get(s);
      return f || (f = /* @__PURE__ */ new Set(), v.set(s, f)), f.add(u), S(
        () => A((x) => (f.delete(u), x))
      ), v;
    });
  }), a;
}
function P(e) {
  const n = [];
  for (let t = 1; t <= e; t++) {
    const c = t / e;
    n.push(c);
  }
  return n.push(0), n;
}
function k(e, n) {
  if (!n) return !1;
  const t = new URL(e, location.href), c = new URL(n, location.href), i = t.pathname.split("/").pop().split(".").slice(0, -1).join(".");
  return c.pathname.includes(i);
}
function h(e, n = !0) {
  const t = /* @__PURE__ */ new Set();
  return [() => {
    const i = E.at(-1);
    return i && (t.add(i), i.dependencies.add(t)), e;
  }, (i) => {
    typeof i == "function" && (i = i(e)), !(e === i && n) && (e = i, [...t].forEach((g) => g.execute()));
  }];
}
function H(e) {
  const n = () => {
    for (t.dependencies.forEach((c) => c.delete(t)), t.dependencies.clear(); t.cleanups.length; )
      t.cleanups.pop()();
  }, t = {
    execute() {
      n(), E.push(t);
      try {
        e();
      } finally {
        E.pop();
      }
    },
    dependencies: /* @__PURE__ */ new Set(),
    cleanups: []
  };
  return S(n), t.execute(), n;
}
function S(e) {
  E.at(-1)?.cleanups?.push(e);
}
function I(e) {
  const [n, t] = h();
  return H(() => t(() => e())), n;
}
