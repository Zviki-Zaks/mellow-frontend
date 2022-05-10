import { socketService } from "../../services/socket.service"
import { boardService } from "../../services/board-service"
import { utilService } from "../../services/util-service";


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
            state.boards.splice(boardIdx, 1, updatedBoard)
        },
        saveBoard(state, { savedBoard }) {
            const idx = state.boards.findIndex(b => b._id === savedBoard._id)
            state.boards.splice(idx, 1, savedBoard)
        },
        saveGroup(state, { boardId, group }) {
            const updatingBoard = state.boards.find(b => b._id === boardId)
            const idx = updatingBoard.groups.findIndex(g => g.id === group.id)
            if (idx === -1) return updatingBoard.groups.push(group)
            updatingBoard.groups.splice(idx, 1, group)
            state.currBoard = updatingBoard
        },
        saveTask(state, { boardId, groupId, task }) {
            const updatingBoard = state.boards.find(b => b._id === boardId)
            const updatingGroup = updatingBoard.groups.find(g => g.id === groupId)
            const idx = updatingGroup.tasks.findIndex(t => t.id === task.id)
            if (idx === -1) return updatingGroup.tasks.push(task)
            updatingGroup.tasks.splice(idx, 1, task)
            state.currBoard = updatingBoard
        },
        removeTask(state, { board, group, taskIdx }) {
            group.tasks.splice(taskIdx, 1)
            state.currBoard = board
        },
        removeGroup(state, { board, groupIdx }) {
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
                // updatedBoard.activities.push(activity)
                const savedBoard = await boardService.save(updatedBoard, activity)
                commit({ type: 'saveBoard', savedBoard })
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log('board module removeTask cant remove task now', err);
            }
        },
        async removeGroup({ commit, state }, { boardId, groupId, activity }) {
            try {
                const board = state.boards.find(board => board._id === boardId)
                const groupIdx = board.groups.findIndex(group => group.id === groupId)
                await commit({ type: 'removeGroup', board, groupIdx })
                const updatedBoard = JSON.parse(JSON.stringify(state.currBoard))
                // updatedBoard.activities.push(activity)
                const savedBoard = await boardService.save(updatedBoard, activity)
                commit({ type: 'saveBoard', savedBoard })
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log('board module removeGroup cant remove group now', err);
            }
        },
        async editBoard({ state, dispatch }, { boardId, changeType, val }) {
            try {
                const boardToUpdate = JSON.parse(JSON.stringify(state.boards.find(board => board._id === boardId)))
                let change;
                switch (changeType) {
                    case "bgClr":
                        boardToUpdate.style[changeType] = val;
                        boardToUpdate.style.bgImg = "";
                        change = "background";
                        break;
                    case "bgImg":
                        boardToUpdate.style[changeType] = val;
                        boardToUpdate.style.bgClr = "";
                        change = "background";
                        break;
                    case "board title":
                        boardToUpdate.title = val.currentTarget.textContent;
                        change = "title";
                        break;
                    case "toggle favorite":
                        boardToUpdate.isFavorite = !boardToUpdate.isFavorite;
                        change = "toggle favorite";
                        break;
                    case "add members":
                        let boardMembersIds = boardToUpdate.members.map((m) => m._id)
                        val.forEach((member) => {
                            if (!boardMembersIds?.includes(member._id)) {
                                boardToUpdate.members.push(JSON.parse(JSON.stringify(member)))
                            }
                        });
                        change = 'members';
                        break;
                    case "update labels":
                        if (typeof val === 'string') {
                            const idx = boardToUpdate.labels.findIndex((l) => l.id === val);
                            boardToUpdate.labels.splice(idx, 1);
                        } else {
                            const idx = boardToUpdate.labels.findIndex((l) => l.id === val.id);
                            if (idx === -1) boardToUpdate.labels.push(val);
                            else boardToUpdate.labels.splice(idx, 1, val);
                        }
                        change = "labels";
                        break;
                }
                const activity = {
                    id: utilService.makeId(),
                    txt: (`Change board ${change}`),
                    createdAt: Date.now(),
                    byMember:
                        state.loggedinUser || state.guestUser,
                };
                // boardToUpdate.activities.push(activity);
                return await dispatch({
                    type: "saveBoard",
                    board: JSON.parse(JSON.stringify(boardToUpdate), activity),
                });
            } catch (err) {
                console.log("board module editBoard cant edit board now", err)
                throw err
            }
        },
        async saveBoard({ commit }, { board, activity }) {
            try {
                const savedBoard = await boardService.save(board, activity)
                commit({ type: 'saveBoard', savedBoard })
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log("board module saveBoard cant save board now", err)
                throw err
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
                // updatingBoard.activities.push(activity)
                const savedBoard = await boardService.save(updatingBoard, activity)
                commit({ type: 'saveBoard', savedBoard })
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log("board module saveTask cant save task now", err)
            }
        },
        async saveGroup({ commit, state }, { boardId, group, activity }) {
            try {
                await commit({ type: 'saveGroup', boardId, group })
                const updatingBoard = JSON.parse(JSON.stringify(state.currBoard))
                // updatingBoard.activities.push(activity)
                const savedBoard = await boardService.save(updatingBoard, activity)
                commit({ type: 'saveBoard', savedBoard })
                return JSON.parse(JSON.stringify(savedBoard))
            } catch (err) {
                console.log("board module saveGroup cant save group now", err)
            }
        },
    }
}
