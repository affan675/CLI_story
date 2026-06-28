export const state = {
    currentRoom: null,
    inventory: [],
    storyData: null,

    init(storyData) {
        this.storyData = storyData;
        this.currentRoom = storyData.start;
        this.inventory = [];
    },

    getCurrentRoomObj() {
        return this.storyData.rooms[this.currentRoom];
    },

    moveTo(roomKey) {
        if (this.storyData.rooms[roomKey]) {
            this.currentRoom = roomKey;
            return true;
        }
        return false;
    }
};