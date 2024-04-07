/**
 * 
 * @param {HTMLImageElement} img 
 * @param {HTMLDivElement} div 
 * @returns 
 */
export default function(img, div) { 
    return (ev) => {
        div.parentElement.removeChild(div);
        img.classList.remove('loading');
        img.classList.add('loaded');
    }
}