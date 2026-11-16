/**
 * APIs del navegador que jsdom 29 no implementa y que usa la app. Son lo mínimo
 * para que los componentes funcionen en los tests; no emulan el layout.
 */

// <dialog>.showModal() / close() (SidePanel). Escape dispara "cancel" como en el
// navegador, para poder testear el cierre del panel con el teclado.
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  const escapeListeners = new WeakMap<HTMLDialogElement, (event: KeyboardEvent) => void>();

  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const cancel = new Event("cancel", { cancelable: true });
      if (this.dispatchEvent(cancel)) this.close();
    };
    escapeListeners.set(this, onKeyDown);
    this.ownerDocument.addEventListener("keydown", onKeyDown);
  };

  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    const onKeyDown = escapeListeners.get(this);
    if (onKeyDown) this.ownerDocument.removeEventListener("keydown", onKeyDown);
    this.dispatchEvent(new Event("close"));
  };
}

// Scroll programático (paginación y vuelta arriba de la lista): sin layout, no-op.
if (!Element.prototype.scrollTo) Element.prototype.scrollTo = () => {};
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
