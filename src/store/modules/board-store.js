import { boardService } from "../../services/board-service";

export default {
  state: {
    boards: [],
    currBoard: null,
    filterBy: null,
  },
  getters: {
    boards({ boards }) {
      return JSON.parse(JSON.stringify(boards));
    },
    favoriteBoards({ boards }) {
      return boards.filter((board) => board.isFavorite);
    },
    getCurrBoard({ currBoard }) {
      return JSON.parse(JSON.stringify(currBoard));
    },
  },
  mutations: {
    setFilter(state, { filterBy }) {
      state.filterBy = filterBy;
    },
    setBoards(state, { boards }) {
      state.boards = boards;
    },
    addBoard(state, { board }) {
      state.boards.push(board);
    },
    removeBoard(state, { boardId }) {
      state.boards = state.boards.filter((board) => board._id !== boardId);
    },
    setCurrBoard(state, { board }) {
      state.currBoard = JSON.parse(JSON.stringify(board));
    },
    saveBoard(state, { savedBoard }) {
      const idx = state.boards.findIndex((b) => b._id === savedBoard._id);
      state.boards.splice(idx, 1, savedBoard);
    },
  },
  actions: {
    async loadBoards({ commit }) {
      try {
        const boards = await boardService.query();
        commit({ type: "setBoards", boards });
      } catch (err) {
        console.log("board module loadBoards cant load boards now", err);
      }
    },
    async loadBoard({ commit }, { boardId }) {
      try {
        const board = await boardService.getById(boardId);
        commit({ type: "setCurrBoard", board });
        return JSON.parse(JSON.stringify(board));
      } catch (err) {
        console.log("board module loadBoard cant load board now", err);
      }
    },
    async addBoard({ dispatch }, { title, bgClr, bgImg }) {
      try {
        const newBoard = boardService.getEmptyBoard();
        newBoard.title = title;
        newBoard.style.bgClr = bgClr;
        newBoard.style.bgImg = bgImg;
        const activity = {
          txt: "Add board",
        };
        return await dispatch({
          type: "saveBoard",
          board: JSON.parse(JSON.stringify(boardToUpdate)),
          activity: JSON.parse(JSON.stringify(activity)),
        });
      } catch (err) {
        console.log("board module addBoard cant load boards now", err);
      }
    },
    async removeBoard({ commit }, { boardId }) {
      try {
        await boardService.remove(boardId);
        commit({ type: "removeBoard", boardId });
      } catch (err) {
        console.log("board module removeBoard cant load boards now", err);
      }
    },
    async removeTask(
      { dispatch, state },
      { boardId, groupId, task, changeType }
    ) {
      try {
        const boardToUpdate = JSON.parse(
          JSON.stringify(state.boards.find((b) => b._id === boardId))
        );
        const group = boardToUpdate.groups.find(
          (group) => group.id === groupId
        );
        const taskIdx = group.tasks.findIndex((t) => t.id === task.id);
        group.tasks.splice(taskIdx, 1);
        const activity = {
          txt: changeType,
          groupId,
          task: { id: task.id, title: task.title },
        };
        return await dispatch({
          type: "saveBoard",
          board: JSON.parse(JSON.stringify(boardToUpdate)),
          activity: JSON.parse(JSON.stringify(activity)),
        });
      } catch (err) {
        console.log("board module removeTask cant remove task now", err);
      }
    },
    async removeGroup({ dispatch, state }, { boardId, groupId }) {
      try {
        const boardToUpdate = JSON.parse(
          JSON.stringify(state.boards.find((b) => b._id === boardId))
        );
        const groupIdx = boardToUpdate.groups.findIndex(
          (group) => group.id === groupId
        );
        boardToUpdate.groups.splice(groupIdx, 1);
        const activity = {
          txt: "remove group",
          group: { id: groupId },
        };
        return await dispatch({
          type: "saveBoard",
          board: JSON.parse(JSON.stringify(boardToUpdate)),
          activity: JSON.parse(JSON.stringify(activity)),
        });
      } catch (err) {
        console.log("board module removeGroup cant remove group now", err);
      }
    },
    async editBoard({ state, dispatch }, { boardId, changeType, val }) {
      try {
        const boardToUpdate = JSON.parse(
          JSON.stringify(state.boards.find((b) => b._id === boardId))
        );
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
            let boardMembersIds = boardToUpdate.members.map((m) => m._id);
            val.forEach((member) => {
              if (!boardMembersIds?.includes(member._id)) {
                boardToUpdate.members.push(JSON.parse(JSON.stringify(member)));
              }
            });
            change = "members";
            break;
          case "update labels":
            if (typeof val === "string") {
              const idx = boardToUpdate.labels.findIndex((l) => l.id === val);
              boardToUpdate.labels.splice(idx, 1);
            } else {
              const idx = boardToUpdate.labels.findIndex(
                (l) => l.id === val.id
              );
              if (idx === -1) boardToUpdate.labels.push(val);
              else boardToUpdate.labels.splice(idx, 1, val);
            }
            change = "labels";
            break;
        }
        const activity = {
          txt: `Change board ${change}`,
        };
        return await dispatch({
          type: "saveBoard",
          board: JSON.parse(JSON.stringify(boardToUpdate)),
          activity: JSON.parse(JSON.stringify(activity)),
        });
      } catch (err) {
        console.log("board module editBoard cant edit board now", err);
        throw err;
      }
    },
    async saveBoard({ commit }, { board, activity }) {
      try {
        const savedBoard = await boardService.save(board, activity);
        commit({ type: "saveBoard", savedBoard });
        commit({ type: "setCurrBoard", board: savedBoard });
        return JSON.parse(JSON.stringify(savedBoard));
      } catch (err) {
        console.log("board module saveBoard cant save board now", err);
        throw err;
      }
    },
    async attachImg({ commit }, { ev }) {
      try {
        const img = await boardService.uploadImg(ev);
        return img;
      } catch (err) {
        console.log("board module attachImg cant attach img now", err);
      }
    },
    async saveTask(
      { dispatch, state },
      { boardId, groupId, task, changeType }
    ) {
      try {
        const boardToUpdate = JSON.parse(
          JSON.stringify(state.boards.find((b) => b._id === boardId))
        );
        const updatingGroup = boardToUpdate.groups.find(
          (g) => g.id === groupId
        );
        const idx = updatingGroup.tasks.findIndex((t) => t.id === task.id);
        if (idx === -1) updatingGroup.tasks.push(task);
        else updatingGroup.tasks.splice(idx, 1, task);
        const activity = {
          txt: changeType,
          groupId,
          task: { id: task.id, title: task.title },
        };
        return await dispatch({
          type: "saveBoard",
          board: JSON.parse(JSON.stringify(boardToUpdate)),
          activity: JSON.parse(JSON.stringify(activity)),
        });
      } catch (err) {
        console.log("board module saveTask cant save task now", err);
      }
    },
    async saveGroup({ dispatch, state }, { boardId, group, changeType }) {
      try {
        const boardToUpdate = JSON.parse(
          JSON.stringify(state.boards.find((b) => b._id === boardId))
        );
        const idx = boardToUpdate.groups.findIndex((g) => g.id === group.id);
        if (idx === -1) boardToUpdate.groups.push(group);
        else boardToUpdate.groups.splice(idx, 1, group);
        const activity = {
          txt: changeType,
          group: { id: group.id, title: group.title },
        };
        return await dispatch({
          type: "saveBoard",
          board: JSON.parse(JSON.stringify(boardToUpdate)),
          activity: JSON.parse(JSON.stringify(activity)),
        });
      } catch (err) {
        console.log("board module saveGroup cant save group now", err);
      }
    },
  },
};
