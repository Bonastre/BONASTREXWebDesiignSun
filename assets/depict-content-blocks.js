const context = [];

class DepictBlockMedia extends HTMLElement {
  static onElementRemoved = new Map();
  static elementsToTheLeftOf = new Map();
  static elementsToTheRightOf = new Map();

  static intersectionObserver = new IntersectionObserver(
    entries =>
      entries.forEach(({ target, boundingClientRect }) =>
        DepictBlockMedia.findAdjacentElements(target, boundingClientRect)
      ),
    // Notify at every 1% change in intersection ratio
    { threshold: buildThresholdList(100) }
  );

  static findAdjacentElements(depictBlockMediaElement, boundingClientRect) {
    const spanRows = +depictBlockMediaElement.dataset.spanRows;
    const spanColumns = +depictBlockMediaElement.dataset.spanColumns;
    const { height, width } = boundingClientRect;
    const approximatelyOneRow = height / spanRows;
    const approximatelyOneColumn = width / spanColumns;
    const halfLastRowRelativeToHeight = height - approximatelyOneRow + approximatelyOneRow / 2;
    const absoluteHalfLastRow = boundingClientRect.top + halfLastRowRelativeToHeight;
    const windowHeight = innerHeight;
    const bottomHalfOfLastRowIsInViewport =
      (absoluteHalfLastRow >= 0 && absoluteHalfLastRow <= windowHeight) ||
      (boundingClientRect.bottom >= 0 && boundingClientRect.bottom <= windowHeight);

    if (!bottomHalfOfLastRowIsInViewport) return;
    // We know that the bottom half of the last row is in the viewport, that means the user might see our padding,
    // which means we can (elementsFromPoint only works on elements in the viewport) and have to (because the user will notice if it's wrong) calculate it.
    const siblingsOfOurParent = new Set(depictBlockMediaElement.parentElement.parentElement.children);
    const xToCheckLeft = boundingClientRect.left - approximatelyOneColumn / 2;
    const xToCheckRight = boundingClientRect.right + approximatelyOneColumn / 2;
    const yToCheck = Math.max(absoluteHalfLastRow, 0);
    const filterFn = el => siblingsOfOurParent.has(el);
    // In case there's a popup or menu above the element, check all elements at that point and filter for the ones that are siblings of our parent
    const elementToTheLeft = document.elementsFromPoint(xToCheckLeft, yToCheck).find(filterFn);
    const elementToTheRight = document.elementsFromPoint(xToCheckRight, yToCheck).find(filterFn);
    const [, setElementToTheRight] = DepictBlockMedia.elementsToTheLeftOf.get(depictBlockMediaElement);
    const [, setElementToTheLeft] = DepictBlockMedia.elementsToTheRightOf.get(depictBlockMediaElement);
    // This often runs when scrolling or resizing, the signals give us de-duplication, so we only create ResizeObservers when the element to the left/right actually changes
    setElementToTheRight(elementToTheRight);
    setElementToTheLeft(elementToTheLeft);
  }

  // Use custom elements to hook into the lifecycle of one of our content block elements being in the DOM.
  connectedCallback() {
    const { intersectionObserver, onElementRemoved, elementsToTheLeftOf, elementsToTheRightOf } = DepictBlockMedia;
    const elementToTheLeftSignal = createSignal();
    const elementToTheRightSignal = createSignal();
    const [elementToTheLeft] = elementToTheLeftSignal;
    const [elementToTheRight] = elementToTheRightSignal;

    elementsToTheLeftOf.set(this, elementToTheLeftSignal);
    elementsToTheRightOf.set(this, elementToTheRightSignal);

    // We only have this effect because we haven't implemented createRoot, we never want it to re-execute, just need it to clean up all the other effects inside it.
    const cleanupEffect = createEffect(() => {
      // Since we don't have batch implemented, use a separate memo for every element
      const leftImageOffset = createMemo(() => {
        reCheckImagesToggle();
        return watchImageOffset(elementToTheLeft());
      });
      const rightImageOffset = createMemo(() => {
        reCheckImagesToggle();
        return watchImageOffset(elementToTheRight());
      });

      // Now we know the changing offsets of changing elements in an efficient way, we can calculate the padding for the largest image (which is the smallest one that's set)
      const finalOffset = createMemo(() => {
        const left = leftImageOffset()();
        const right = rightImageOffset()();
        return Math.min(left ?? Infinity, right ?? Infinity);
      });
      createEffect(() => {
        const offset = finalOffset();
        this.style.setProperty("--align-to-image-offset", `${offset === Infinity ? 0 : offset}px`);
      });

      // Set offset for content blocks to our side, that aren't directly besides a product they can get the size of
      setExistingOffsets(prev => prev.set(this, finalOffset));
      onCleanup(() =>
        setExistingOffsets(prev => {
          prev.delete(this);
          return prev;
        })
      );
    });

    intersectionObserver.observe(this);
    onElementRemoved.set(this, [
      // We need to clean up the top-level effect, but child-effects will be cleaned up automatically (there's no createRoot in the simple reactive library)
      cleanupEffect,
      () => {
        intersectionObserver.unobserve(this);
        onElementRemoved.delete(this);
        elementsToTheLeftOf.delete(this);
        elementsToTheRightOf.delete(this);
      },
    ]);
  }

  disconnectedCallback() {
    DepictBlockMedia.onElementRemoved.get(this).forEach(fn => fn());
  }
}

// Sometimes we run querySelectorAll so fast that the images aren't in the DOM yet, it seems, so we have this toggle to trigger a re-check of the images
const [reCheckImagesToggle, setReCheckImagesToggle] = createSignal(false);
const [existingOffsets, setExistingOffsets] = createSignal(new Map(), false);

customElements.define("depict-block-media", DepictBlockMedia);

// "resize" event doesn't fire sometimes when it should (rotating phone for example), also it doesn't when showing/hiding scrollbars which for example, disabling scrolling does
// This is the most reliable way to know the screen got resized
// Ideally this would be in a static initialisation block (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks) in the DepictBlockMedia class because it's a side effect related to those elements, but we don't have transpilation and support for it was only added in safari a year ago
const resizeRO = new ResizeObserver(() => {
  // On window resize, re-find adjacent elements since if the elements are 100% intersecting both before and afterward, the intersectionobservers won't trigger
  for (const element of DepictBlockMedia.elementsToTheLeftOf.keys()) {
    DepictBlockMedia.findAdjacentElements(element, element.getBoundingClientRect());
  }
});
resizeRO.observe(document.documentElement);
resizeRO.observe(document.body);

addEventListener("DOMContentLoaded", () => setReCheckImagesToggle(toggle => !toggle));
addEventListener("load", () => setReCheckImagesToggle(toggle => !toggle));

function watchImageOffset(maybeProductCardElement) {
  if (maybeProductCardElement?.matches(".depict-content-block")) {
    // If the row contains block, 2x block, product and we are the first block, we "connect" and get the offset from the block besides us, which gets it from the actual product besides it
    const mediaElement = maybeProductCardElement.querySelector("depict-block-media");
    return () => existingOffsets().get(mediaElement)?.();
  }

  const [imageOffset, setImageOffset] = createSignal();
  const [cardHeight, setCardHeight] = createSignal(0);
  const [defaultImageHeight, setDefaultImageHeight] = createSignal(0);
  const [hoverImageHeight, setHoverImageHeight] = createSignal(0);
  const allImageChildren = maybeProductCardElement?.querySelectorAll(`img`);
  const findImage = filename => {
    if (!filename) return;

    for (const image of allImageChildren) {
      if (matchFilename(filename, image.src)) {
        return image;
      }
      if (matchFilename(filename, image.srcset)) {
        return image;
      }
    }
  };
  const defaultImage = findImage(maybeProductCardElement?.dataset?.defaultImage);
  const hoverImage = findImage(maybeProductCardElement?.dataset?.hoverImage);

  if (maybeProductCardElement && (defaultImage || hoverImage)) {
    const resizeObserver = new ResizeObserver(records => {
      for (const {
        target,
        contentRect: { height },
      } of records) {
        if (target === maybeProductCardElement) {
          setCardHeight(height);
        } else if (target === defaultImage) {
          setDefaultImageHeight(height);
        } else {
          setHoverImageHeight(height);
        }
      }
    });
    createEffect(() => {
      const cardHeightValue = cardHeight();
      const imageHeightValue = defaultImageHeight() || hoverImageHeight();
      if (cardHeightValue && imageHeightValue) {
        const offset = cardHeightValue - imageHeightValue;
        setImageOffset(offset);
      } else {
        setImageOffset(undefined);
      }
    });
    onCleanup(() => resizeObserver.disconnect());
    if (defaultImage) {
      resizeObserver.observe(defaultImage);
    }
    if (hoverImage) {
      resizeObserver.observe(hoverImage);
    }
    resizeObserver.observe(maybeProductCardElement);
  }

  return imageOffset;
}

function buildThresholdList(numSteps) {
  const thresholds = [];
  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }
  thresholds.push(0);
  return thresholds;
}

// Needed because legacy version of shopify API allows URLs like these https://depict-ai-onboarding-evals.myshopify.com/cdn/shop/files/male-jacket-3_900x.jpg?v=1721808791 where male-jacket-3.jpg is the filename provided to us
function matchFilename(baseFilename, testString) {
  // Extract the base part of the filename without extension and extract the extension
  const match = baseFilename.match(/^(.+?)(\.\w+)$/);
  if (!match) {
    console.error("Invalid base filename format. Ensure it has an extension.");
    return false;
  }

  const basePart = match[1];
  const extension = match[2];

  // Create a regex pattern dynamically
  const pattern = new RegExp(`${escapeRegex(basePart)}(_\\d+x\\d+|_\\d+x)?${escapeRegex(extension)}`, "i");

  // Test the testString against the pattern
  const isMatch = pattern.test(testString);

  // Return the result
  return isMatch;
}

// Helper function to escape regex special characters, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// Simple reactive library inspired by https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p
function createSignal(value, equalityCheck = true) {
  const subscriptions = new Set();
  const read = () => {
    const running = context.at(-1);
    if (running) {
      subscriptions.add(running);
      running.dependencies.add(subscriptions);
    }
    return value;
  };

  const write = nextValue => {
    if (typeof nextValue === "function") nextValue = nextValue(value);
    if (value === nextValue && equalityCheck) return;
    value = nextValue;
    [...subscriptions].forEach(sub => sub.execute());
  };
  return [read, write];
}

function createEffect(fn) {
  const cleanup = () => {
    effect.dependencies.forEach(dep => dep.delete(effect));
    effect.dependencies.clear();
    while (effect.cleanups.length) {
      effect.cleanups.pop()();
    }
  };
  const effect = {
    execute() {
      cleanup();
      context.push(effect);
      try {
        fn();
      } finally {
        context.pop();
      }
    },
    dependencies: new Set(),
    cleanups: [],
  };
  onCleanup(cleanup);
  effect.execute();
  return cleanup;
}
function onCleanup(fn) {
  context.at(-1)?.cleanups?.push(fn);
}
function createMemo(fn) {
  const [s, set] = createSignal();
  createEffect(() => set(() => fn()));
  return s;
}
