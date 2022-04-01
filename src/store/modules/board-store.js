import { socketService } from "../../services/socket.service"
import { boardService } from "../../services/board-service"
// should be boardService

export default {
    state: {
        boards: [],
        currBoard: null,
        filterBy: null,
    },
    getters: {
        boards({ boards }) {
            return JSON.parse(JSON.stringify(boards))
        },
        favoriteBoards({ boards }) {
            return boards.filter((board) => board.isFavorite)
        },
        getCurrBoard({ currBoard }) {
            return JSON.parse(JSON.stringify(currBoard))
        }
    },
    mutations: {
        setFilter(state, { filterBy }) {
            state.filterBy = filterBy
        },
        setBoards(state, { boards }) {
            state.boards = boards
        },
        addBoard(state, { board }) {
            state.boards.push(board)
        },
        removeBoard(state, { boardId }) {
            state.boards = state.boards.filter(board => board._id !== boardId)
        },
        setCurrBoard(state, { board }) {
            state.currBoard = JSON.parse(JSON.stringify(board))
        },
        setFavorite(state, { updatedBoard }) {
            const boardIdx = state.boards.findIndex(board => board._id === updatedBoard._id)
            // console.log(boardIdx);
            state.boards.splice(boardIdx, 1, updatedBoard)
            console.log(state.boards);
            // console.log('updatedBoard', updatedBoard);
        },
        // saveGroup(state, { updatingGroup }) {
        //     if (updatingGroup) {
        //         const idx = state.currBoard.groups.findIndex(g => g.id === updatingGroup.id)
        //         state.currBoard.groups.splice(idx, 1, savedGroup)
        //     }
        //     else {
        //         const newGroup = boardService.getEmptyGroup()
        //         state.currBoard.groups.push(newGroup)
        //     }
        //     this.dispatch({ type: 'saveBoard', board: state.currBoard })
        // },
        saveBoard(state, { savedBoard }) {
            const idx = state.boards.findIndex(b => b._id === savedBoard._id)
            state.boards.splice(idx, 1, savedBoard)
            //////// ask avior ///////
            // state.currBoard = JSON.parse(JSON.stringify(savedBoard))
        },
        saveGroup(state, { boardId, group }) {
            const updatingBoard = state.boards.find(b => b._id === boardId)
            // console.log('boardId', boardId);
            // console.log('group', group);
            // console.log(updatingBoard);
            const idx = updatingBoard.groups.findIndex(g => g.id === group.id)
            // console.log(idx);
            if (idx === -1) return updatingBoard.groups.push(group)
            updatingBoard.groups.splice(idx, 1, group)
            state.currBoard = updatingBoard
        },
        saveTask(state, { boardId, groupId, task }) {
            // console.log(boardId, groupId, task);
            const updatingBoard = state.boards.find(b => b._id === boardId)
            const updatingGroup = updatingBoard.groups.find(g => g.id === groupId)
            // console.log(updatingGroup);
            const idx = updatingGroup.tasks.findIndex(t => t.id === task.id)
            // console.log(idx);
            if (idx === -1) return updatingGroup.tasks.push(task)
            updatingGroup.tasks.splice(idx, 1, task)
            state.currBoard = updatingBoard
        },
        removeTask(state, { board, group, taskIdx }) {
            console.log('before', board);
            group.tasks.splice(taskIdx, 1)
            console.log('after', board);
            state.currBoard = board
        },
        removeGroup(state, { board, groupIdx }) {
            console.log(board, groupIdx);
            board.groups.splice(groupIdx, 1)
            state.currBoard = board
        }
    },
    actions: {
        async loadBoards({ commit }) {
            try {
                const boards = await boardService.query()
                commit({ type: "setBoards", boards })
            } catch (err) {
                console.log("board module loadBoards cant load boards now", err)
            }
        },
        async loadBoard({ commit }, { boardId }) {
            try {
                const board = await boardService.getById(boardId)
                commit({ type: 'setCurrBoard', board })
                return JSON.parse(JSON.stringify(board))
            } catch (err) {
                console.log("board module loadBoard cant load board now", err)
            }
        },
        async addBoard({ commit }, { title, bgClr, bgImg }) {
            try {
                const newBoard = boardService.getEmptyBoard();
                newBoard.title = title
                newBoard.style.bgClr = bgClr
                newBoard.style.bgImg = bgImg
                const board = await boardService.save(newBoard)
                commit({ type: "addBoard", board })
                return board._id
            } catch (err) {
                console.log("board module addBoard cant load boards now", err)
            }
        },
        async removeBoard({ commit }, { boardId }) {
            try {
                await boardService.remove(boardId);
                commit({ type: "removeBoard", boardId })

            } catch (err) {
                console.log("board module removeBoard cant load boards now", err)
            }
        },
        async removeTask({ commit, state }, { boardId, groupId, task, activity }) {
            try {

                const board = state.boards.find(board => board._id === boardId)
                const group = board.groups.find(group => group.id === groupId)
                const taskIdx = group.tasks.findIndex(t => t.id === task.id)
                await commit({ type: 'removeTask', board, group, taskIdx })

                const updatedBoard = JSON.parse(JSON.stringify(state.currBoard))
                updatedBoard.activities.push(activity)

                const savedBoard = await boardService.save(updatedBoard)
                commit({ type: 'saveBoard', savedBoard })

                return JSON.parse(JSON.stringify(savedBoard))

            } catch (err) {
                console.log('board module removeTask cant remove task now', err);
            }
        },
        async removeGroup({ commit, state }, { boardId, groupId, activity }) {
            console.log(boardId, groupId, activity);
            try {
                const board = state.boards.find(board => board._id === boardId)
                const groupIdx = board.groups.findIndex(group => group.id === groupId)
                await commit({ type: 'removeGroup', board, groupIdx })
                const updatedBoard = JSON.parse(JSON.stringify(state.currBoard))
                updatedBoard.activities.push(activity)
                const savedBoard = await boardService.save(updatedBoard)
                commit({ type: 'saveBoard', savedBoard })

                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log('board module removeGroup cant remove group now', err);

            }
        },
        async toggleFavorite({ commit }, { board }) {
            try {
                // const boardToUpdate = await boardService.getById(board.boardId)
                // boardToUpdate.isFavorite = board.status
                // const updatedBoard = await boardService.save(boardToUpdate)
                // commit({ type: "setFavorite", updatedBoard })
                const boardToUpdate = await boardService.getById(board.boardId)
                boardToUpdate.isFavorite = !boardToUpdate.isFavorite
                const updatedBoard = await boardService.save(boardToUpdate)
                commit({ type: 'setFavorite', updatedBoard })

            } catch (err) {
                console.log("board module toggleFavorite cant load boards now", err)
            }
        },
        async saveBoard({ commit }, { board }) {
            try {
                const savedBoard = await boardService.save(board)
                commit({ type: 'saveBoard', savedBoard })
                socketService.emit("board updated")
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log("board module saveBoard cant save board now", err)
            }
        },
        async attachImg({ commit }, { ev }) {
            try {
                const img = await boardService.uploadImg(ev)
                return img
            } catch (err) {
                console.log("board module attachImg cant attach img now", err)
            }
        },
        async saveTask({ commit, state }, { boardId, groupId, task, activity }) {
            try {
                await commit({ type: 'saveTask', boardId, groupId, task })
                const updatingBoard = JSON.parse(JSON.stringify(state.currBoard))
                updatingBoard.activities.push(activity)
                // console.log(updatingBoard);
                const savedBoard = await boardService.save(updatingBoard)
                commit({ type: 'saveBoard', savedBoard })
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log("board module saveTask cant save task now", err)
            }
        },
        async saveGroup({ commit, state }, { boardId, group, activity }) {
            console.log(group);
            try {
                await commit({ type: 'saveGroup', boardId, group })
                const updatingBoard = JSON.parse(JSON.stringify(state.currBoard))
                updatingBoard.activities.push(activity)
                const savedBoard = await boardService.save(updatingBoard)
                commit({ type: 'saveBoard', savedBoard })
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log("board module saveGroup cant save group now", err)
            }
        },
    }
}