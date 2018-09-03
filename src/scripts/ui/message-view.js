let MessageVueManager = new Vue({
    el:"#vue-app-message-display",
    data: {
        messages: []
    },
    methods: {
        typeToClass: function(type) {
            return "has-text-" + type 
        }
    }
})

export const clearMessages = function() {
    MessageVueManager.messages.splice(0, MessageVueManager.messages.length)
}

export const addMessage = function(message, type='danger') {
    MessageVueManager.messages.push({text: message, type: type})
}


