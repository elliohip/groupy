export class Modal extends HTMLDivElement {
    constructor() {
        super()
    }
    show_modal() {
        this.hidden  = false;
    }
    hide_modal() {

    }
    reset_modal() {

    }
    render_gc_edit_screen() {
        this.innerHTML = `
        <div>
            <div class="button rename-group">
                rename group
            </div>
            <div class="button leave-group">
                leave group
            </div>
        </div>
        `;
        this.querySelector(".button.rename-group").addEventListener("click", (ev) => {

        });
        this.querySelector(".button.rename-group").addEventListener("click", (ev) => {

        });
    }
}
