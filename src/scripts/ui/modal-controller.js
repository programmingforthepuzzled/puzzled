exports.initModal = function(data) {
    new Vue({
        el:"#vue-app-modal",
        data: data,
        methods: {
            continueToPuzzle: function() {
                this.active = false
            },

            returnToMenu: function() {
                window.history.back()
            }
        }
    })
};



