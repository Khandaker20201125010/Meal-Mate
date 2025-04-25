export function dispatchCartUpdate() {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}