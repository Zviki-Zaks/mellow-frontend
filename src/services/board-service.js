import { utilService } from "./util-service";
import { httpService } from "./http.service";
import { userService } from "./user-service";
import { socketService } from "./socket.service";

const KEY = "boards_db";
const ENDPOINT = "board";

export const boardService = {
  query,
  getById,
  remove,
  save,
  getEmptyBoard,
  getEmptyGroup,
  getEmptyTask,
  uploadImg,
};

async function query(filterBy = {}) {
  return await httpService.get(ENDPOINT, filterBy);
}

async function getById(id) {
  return await httpService.get(`${ENDPOINT}/${id}`);
}

async function remove(id) {
  return await httpService.delete(`${ENDPOINT}/${id}`);
}

async function save(board, activity) {
  if (activity) {
    activity.id = utilService.makeId();
    activity.createdAt = Date.now();
    const user = userService.getLoggedinUser() || userService.getGuestUser();
    activity.byMember = {
      _id: user._id,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
    };
    if (board.activities.length >= 30) {
      board.activities.shift();
    }
    board.activities.push(activity);
  }
  const updatedBoard = board._id
    ? await httpService.put(`${ENDPOINT}/${board._id}`, board)
    : await httpService.post(ENDPOINT, board);
  socketService.emit("board updated");
  return updatedBoard;
}

async function uploadImg(ev) {
  const UPLOAD_PRESET = "cajan_22";
  const CLOUD_NAME = "cajan22a";
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const FORM_DATA = new FormData();

  FORM_DATA.append("file", ev.target.files[0]);
  FORM_DATA.append("upload_preset", UPLOAD_PRESET);
  return fetch(UPLOAD_URL, {
    method: "POST",
    body: FORM_DATA,
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => console.error(err));
}

function getEmptyGroup() {
  return {
    id: "g-" + utilService.makeId(),
    title: "Enter Group Name",
    tasks: [],
    style: {},
  };
}

function getEmptyTask() {
  return {
    id: "t-" + utilService.makeId(),
    title: "",
    createdAt: Date.now(),
    style: {},
    attachments: [],
  };
}

function getEmptyBoard() {
  const board = {
    title: "",
    isFavorite: false,
    createdAt: Date.now(),
    archivedAt: null,
    createdBy: userService.getLoggedinUser() || userService.getGuestUser(),
    style: { bgClr: "", bgImg: "" },
    labels: [], // when adding custom labels from a component we will add to this, otherwise base colors come from component
    members: userService.getDefaultMembers(), // in component, add curr user to list
    groups: [],
    activities: [],
  };
  return board;
}
