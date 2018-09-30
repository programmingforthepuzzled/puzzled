let modalVm;

exports.initModal = function (data) {
    data = Object.assign(data, { onLast: false })

    modalVm = new Vue({
        el: "#vue-app-modal",
        data: data,
        methods: {
            continueToPuzzle: function () {
                this.active = false
            },

            returnToMenu: function () {
                window.history.back()
            }
        }
    })
};

window.setTimeout(function () {
    document.querySelector('.button.is-success').focus()
}, 0);

window.addEventListener("keydown", e => {
    if (e.keyCode === 9 && modalVm.active) {
        event.preventDefault()
        if (document.activeElement === document.querySelector('.button.is-success')) {
            document.querySelector('.button.is-danger').focus()
        } else {
            document.querySelector('.button.is-success').focus()
        }
    }
})


