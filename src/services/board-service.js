// import axios from 'axios'
import { utilService } from "./util-service";
import { httpService } from "./http.service";
import { storageService } from "./async-storage-service";
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

// _createBoards()

async function query(filterBy = {}) {
  return await httpService.get(ENDPOINT, filterBy);

  // return storageService.query(KEY)
}

async function getById(id) {
  return await httpService.get(`${ENDPOINT}/${id}`);

  // return storageService.getById(KEY, id)
}

async function remove(id) {
  return await httpService.delete(`${ENDPOINT}/${id}`);

  // return storageService.remove(KEY, id)
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
  // if (board._id) return storageService.put(KEY, board)
  // return storageService.post(KEY, board)
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
    members: [
      {
        _id: "u105",
        fullname: "Yoni Lazarus",
        username: "Yoni",
        imgUrl:
          "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.02.12_gmtcrl.jpg",
      },
      {
        _id: "u106",
        fullname: "Almog Ben-Binyamin",
        username: "Almog",
        imgUrl:
          "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2021-12-10_at_16.38.26_sft38h.jpg",
      },
      {
        _id: "u107",
        fullname: "Zviki Zaks",
        username: "Zviki",
        imgUrl:
          "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.17.15_rq2ja9.jpg",
      },
    ], // in component, add curr user to list
    groups: [],
    activities: [],
  };
  return board;
}

function _createBoards() {
  let boards = utilService.loadFromStorage(KEY);
  if (!boards || !boards.length) {
    boards = [
      {
        _id: "b101",
        title: "Frontend Build",
        isFavorite: false,
        createdAt: 1648368189547,
        createdBy: {
          _id: "u101",
          fullname: "Abi Abambi",
          imgUrl: "",
        },
        style: {
          bgImg: "../assets/imgs/1.jpg",
        },
        labels: [
          {
            id: "l101",
            color: "#61bd4f",
            title: "Done",
          },
          {
            id: "l102",
            color: "#f2d600",
            title: "Urgent",
          },
          {
            id: "l103",
            color: "#ff9f1a",
            title: "Immediate",
          },
          {
            id: "l104",
            color: "#eb5a46",
            title: "",
          },
          {
            id: "l105",
            color: "#c377e0",
            title: "",
          },
          {
            id: "l106",
            color: "#0079bf",
            title: "",
          },
        ],
        members: [
          {
            _id: "u105",
            fullname: "Yoni Lazarus",
            username: "Yoni",
            imgUrl:
              "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.02.12_gmtcrl.jpg",
          },
          {
            _id: "u106",
            fullname: "Almog Ben-Binyamin",
            username: "Almog",
            imgUrl:
              "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2021-12-10_at_16.38.26_sft38h.jpg",
          },
          {
            _id: "u107",
            fullname: "Zviki zaks",
            username: "Zviki",
            imgUrl:
              "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.17.15_rq2ja9.jpg",
          },
        ],
        groups: [
          {
            id: "g101",
            title: "Immediate Todos",
            tasks: [
              {
                id: "c101",
                title: "Replace logo",
                style: { bgClr: "", bgImg: "", isFullCover: false },
              },
              {
                id: "t-nMLMX279",
                title: "Remove excess pixels between group-list and scroll bar",
                createdAt: 1648369020184,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                labelIds: ["l102", "l103", "l104"],
                dueDate: {
                  dueDate: "2022-03-26T08:20:13.473Z",
                  isCompleted: false,
                },
              },
              {
                id: "t-TI4ANfXQ",
                title: "Render the photos to task preview",
                createdAt: 1648369100551,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [
                  "http://res.cloudinary.com/cajan22a/image/upload/v1648373054/books-g629e7f9c8_640_ihanz0.jpg",
                ],
                labelIds: ["l101"],
              },
            ],
            style: {},
          },
          {
            id: "g102",
            title: "Components to Build",
            tasks: [
              {
                id: "c103",
                title: "Archive instead of Delete",
                style: { bgClr: "", bgImg: "", isFullCover: false },
              },
              {
                id: "c104",
                title: "Proper layout and full CRUD of images",
                checklists: [
                  {
                    id: "YEtgF",
                    title: "Checklist",
                    todos: [
                      {
                        id: "325jX",
                        title: "To Do 1",
                        isDone: false,
                      },
                    ],
                  },
                ],
                style: { bgClr: "26de81", bgImg: "", isFullCover: false },
                members: [
                  {
                    _id: "u105",
                    fullname: "Yoni Lazarus",
                    username: "Yoni",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.02.12_gmtcrl.jpg",
                  },
                  {
                    _id: "u107",
                    fullname: "Zviki zaks",
                    username: "Zviki",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.17.15_rq2ja9.jpg",
                  },
                ],
                labelIds: ["l102", "l103", "l104"],
                description: "Toggle should change image on task preview",
              },
              {
                id: "t-PiYcSy3j",
                title: "Cover photo, make sure the first added is the default",
                createdAt: 1648369148256,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                description:
                  "...subsequent ones can be changed manually to be the cover photos. Trello has this as its default, looks really nice",
                dueDate: {
                  dueDate: "2022-03-27T09:30:00.000Z",
                  isCompleted: false,
                },
              },
              {
                id: "c105",
                title: "Render and add comments",
                status: "in-progress",
                description:
                  "This will need a full update when the sockets are added but for now work on basic adding and rendering",
                comments: [
                  {
                    id: "ZdPnm",
                    txt: "also @yaronb please CR this",
                    createdAt: 1590999817436,
                    byMember: {
                      _id: "u101",
                      fullname: "Tal Tarablus",
                      imgUrl:
                        "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
                    },
                  },
                ],
                checklists: [
                  {
                    id: "YEhmFk111",
                    title: "Checklist",
                    todos: [
                      {
                        id: "212jX111",
                        title: "To Do 1",
                        isDone: true,
                      },
                    ],
                  },
                  {
                    id: "YEhmF222",
                    title: "Checklist",
                    todos: [
                      {
                        id: "212jX222",
                        title: "To Do 2",
                        isDone: false,
                      },
                      {
                        id: "212jX333",
                        title: "To Do 3 is done",
                        isDone: true,
                      },
                    ],
                  },
                ],
                members: [
                  {
                    _id: "u105",
                    fullname: "Yoni Lazarus",
                    username: "Yoni",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.02.12_gmtcrl.jpg",
                  },
                  {
                    _id: "u106",
                    fullname: "Almog Ben-Binyamin",
                    username: "Almog",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2021-12-10_at_16.38.26_sft38h.jpg",
                  },
                  {
                    _id: "u107",
                    fullname: "Zviki zaks",
                    username: "Zviki",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.17.15_rq2ja9.jpg",
                  },
                ],
                labelIds: ["l107", "l108", "l103"],
                createdAt: 1590999730348,
                byMember: {
                  _id: "u101",
                  username: "Tal",
                  fullname: "Tal Tarablus",
                  imgUrl:
                    "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
                },
                style: { bgClr: "", bgImg: "", isFullCover: false },
                dueDate: {
                  dueDate: "2022-03-29T21:40:27.228Z",
                  isCompleted: false,
                },
                attachments: [
                  "http://res.cloudinary.com/cajan22a/image/upload/v1648363384/Headshot_Yoni_2021_gkcpbo.jpg",
                ],
              },
              {
                id: "t-KkqBkx4T",
                title:
                  "Checklists, super important to be next on our list, it adds a lot of value",
                createdAt: 1648369395722,
                members: [
                  {
                    _id: "u105",
                    fullname: "Yoni Lazarus",
                    username: "Yoni",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.02.12_gmtcrl.jpg",
                  },
                  {
                    _id: "u106",
                    fullname: "Almog Ben-Binyamin",
                    username: "Almog",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2021-12-10_at_16.38.26_sft38h.jpg",
                  },
                ],
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
              },
              {
                id: "t-QzjP3br7",
                title: "Full CRUD of name and cards, without exception",
                createdAt: 1648371305685,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                labelIds: ["l102"],
              },
              {
                id: "t-VCawXr0K",
                title:
                  "Render the data we have been collecting from the activities, the button to show and hide has been prepared",
                createdAt: 1648369658477,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                labelIds: ["l105"],
                dueDate: {
                  dueDate: "2022-03-28T08:25:53.455Z",
                  isCompleted: false,
                },
              },
            ],
            style: {},
          },
          {
            id: "g-05mqUAOd",
            title: "Feedback from Avior",
            tasks: [
              {
                id: "t-J6zOG2sn",
                title: "Take a few pictures from the internet for demo data",
                createdAt: 1648368936226,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                description: "",
                dueDate: {
                  dueDate: "2022-03-30T15:25:00.000Z",
                  isCompleted: false,
                },
              },
              {
                id: "t-FlDqD6BG",
                title:
                  "Make sure to relax before the meeting with Asaf, and do a good job",
                createdAt: 1648369464026,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [
                  "http://res.cloudinary.com/cajan22a/image/upload/v1648373021/dog-gd9e48bc3a_640_xonhij.jpg",
                ],
                members: [
                  {
                    _id: "u105",
                    fullname: "Yoni Lazarus",
                    username: "Yoni",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.02.12_gmtcrl.jpg",
                  },
                  {
                    _id: "u106",
                    fullname: "Almog Ben-Binyamin",
                    username: "Almog",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2021-12-10_at_16.38.26_sft38h.jpg",
                  },
                  {
                    _id: "u107",
                    fullname: "Zviki zaks",
                    username: "Zviki",
                    imgUrl:
                      "https://res.cloudinary.com/cajan22a/image/upload/v1648369158/WhatsApp_Image_2022-03-27_at_11.17.15_rq2ja9.jpg",
                  },
                ],
                labelIds: ["l105", "l106"],
                description:
                  "The meeting will be short, give a quick run through of the flow, get good feedback",
                dueDate: {
                  dueDate: "2022-03-27T09:30:00.000Z",
                  isCompleted: false,
                },
              },
            ],
            style: {},
          },
          {
            id: "g-Wen1SpyZ",
            title: "Done",
            tasks: [
              {
                id: "t-yNkTEECH",
                title:
                  "Reduce number of default labels on the boards to maximim of 6",
                createdAt: 1648369068557,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [
                  "http://res.cloudinary.com/cajan22a/image/upload/v1648373005/code-g6edc9f26e_640_bznsbp.jpg",
                ],
                labelIds: ["l101"],
                dueDate: {
                  dueDate: "2022-03-26T16:20:00.000Z",
                  isCompleted: true,
                },
              },
              {
                id: "t-7JKrUUZr",
                title: "Clean up demo data",
                createdAt: 1648369083537,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
              },
            ],
            style: {},
          },
          {
            id: "g-va8kuIE2",
            title: "For later this week",
            tasks: [
              {
                id: "t-0HhNSPhU",
                title: "Look at Quello for extra add-on ideas",
                createdAt: 1648369345282,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                labelIds: ["l105"],
              },
              {
                id: "t-U5qT2Gud",
                title: "Full working filter",
                createdAt: 1648373985129,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                dueDate: {
                  dueDate: "2022-03-28T14:00:00.000Z",
                  isCompleted: false,
                },
                labelIds: ["l102"],
              },
            ],
            style: {},
          },
          {
            id: "g-HIKOO3fg",
            title: "Plan for Backend",
            tasks: [
              {
                id: "t-UEohipxO",
                title: "Make list of all potential bugs",
                createdAt: 1648373155582,
                style: { bgClr: "", bgImg: "", isFullCover: false },
                attachments: [],
                dueDate: {
                  dueDate: "2022-03-31T09:25:01.470Z",
                  isCompleted: false,
                },
              },
            ],
            style: {},
          },
        ],
        activities: [
          {
            id: "a101",
            txt: "Changed Color",
            createdAt: 154514,
            byMember: {
              _id: "u101",
              fullname: "Abi Abambi",
              imgUrl: "",
            },
            task: {
              id: "c101",
              title: "Replace Logo",
            },
          },
          {
            id: "rgQTUE70",
            txt: "save group title",
            createdAt: 1648368203097,
            group: {
              id: "g101",
              title: "Group 1",
            },
          },
          {
            id: "tl2mQu8G",
            txt: "save group title",
            createdAt: 1648368204208,
            group: {
              id: "g101",
              title: "Group 1",
            },
          },
          {
            id: "NnJYheAO",
            txt: "save group title",
            createdAt: 1648368238800,
            group: {
              id: "g101",
              title: "Immediate Todos",
            },
          },
          {
            id: "1eThwGFa",
            txt: "save group title",
            createdAt: 1648368247802,
            group: {
              id: "g102",
              title: "Group 2",
            },
          },
          {
            id: "TwyX7WVn",
            txt: "save group title",
            createdAt: 1648368257335,
            group: {
              id: "g102",
              title: "Group 2",
            },
          },
          {
            id: "P9N2ZAx5",
            txt: "save group title",
            createdAt: 1648368266639,
            group: {
              id: "g102",
              title: "Components to Build",
            },
          },
          {
            id: "ZJfHOeCx",
            txt: "save group title",
            createdAt: 1648368294433,
            group: {
              id: "g-05mqUAOd",
              title: "Backend",
            },
          },
          {
            id: "a5o3Iidt",
            txt: "save group title",
            createdAt: 1648368301129,
            group: {
              id: "g-Wen1SpyZ",
              title: "Done",
            },
          },
          {
            id: "yTPbecRE",
            txt: "save group title",
            createdAt: 1648368321763,
            group: {
              id: "g-05mqUAOd",
              title: "Backend",
            },
          },
          {
            id: "GZ8MoaPj",
            txt: "save group title",
            createdAt: 1648368341989,
            group: {
              id: "g-05mqUAOd",
              title: "",
            },
          },
          {
            id: "w4QDHcjt",
            txt: "save group title",
            createdAt: 1648368362600,
            group: {
              id: "g-05mqUAOd",
              title: "",
            },
          },
          {
            id: "uDaQqQy5",
            txt: "save group title",
            createdAt: 1648368473189,
            group: {
              id: "g-05mqUAOd",
              title: "",
            },
          },
          {
            id: "6YEYWYEX",
            txt: "save group title",
            createdAt: 1648368484876,
            group: {
              id: "g-05mqUAOd",
              title: "Feedback from Avior",
            },
          },
          {
            id: "87inrkd0",
            txt: "save group title",
            createdAt: 1648368866764,
            group: {
              id: "g101",
              title: "Immediate Todos",
            },
          },
          {
            id: "uEUUMiyC",
            txt: "add task",
            createdAt: 1648368936226,
            group: {
              id: "g-05mqUAOd",
              title: "Feedback from Avior",
            },
          },
          {
            id: "5IHDG42X",
            txt: "save group title",
            createdAt: 1648368936285,
            group: {
              id: "g-Wen1SpyZ",
              title: "Done",
            },
          },
          {
            id: "7vJxYdQt",
            txt: "add task",
            createdAt: 1648369020184,
            group: {
              id: "g-05mqUAOd",
              title: "Feedback from Avior",
            },
          },
          {
            id: "3D5DAGK1",
            txt: "add task",
            createdAt: 1648369068558,
            group: {
              id: "g-Wen1SpyZ",
              title: "Done",
            },
          },
          {
            id: "GdJKjLTI",
            txt: "add task",
            createdAt: 1648369083538,
            group: {
              id: "g-Wen1SpyZ",
              title: "Done",
            },
          },
          {
            id: "AK6NkjMO",
            txt: "add task",
            createdAt: 1648369100552,
            group: {
              id: "g101",
              title: "Immediate Todos",
            },
          },
          {
            id: "LvhBJbun",
            txt: "add task",
            createdAt: 1648369148256,
            group: {
              id: "g102",
              title: "Components to Build",
            },
          },
          {
            id: "ApT83fwp",
            txt: "Updated Description",
            groupId: "g102",
            createdAt: 1648369196991,
            task: {
              id: "t-PiYcSy3j",
              title:
                "Cover photo, make sure the first added is the default, subsequent ones can be changed manually to be the cover photos",
            },
          },
          {
            id: "8inzUrXY",
            txt: "Updated due date",
            groupId: "g102",
            createdAt: 1648369215650,
            task: {
              id: "t-PiYcSy3j",
              title:
                "Cover photo, make sure the first added is the default, subsequent ones can be changed manually to be the cover photos",
            },
          },
          {
            id: "1j6i4sgw",
            txt: "Change Labels",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648369233890,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "XMAfpcgo",
            txt: "Updated due date",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648369247655,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "YoopJ1OF",
            txt: "updated due date status",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648369250689,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "UVjL7gYu",
            txt: "Change Labels",
            groupId: "g-05mqUAOd",
            createdAt: 1648369267807,
            task: {
              id: "t-nMLMX279",
              title: "Remove exess pixels between group-list and scroll bar",
            },
          },
          {
            id: "ezQ6TWn9",
            txt: "Change Labels",
            groupId: "g-05mqUAOd",
            createdAt: 1648369269161,
            task: {
              id: "t-nMLMX279",
              title: "Remove exess pixels between group-list and scroll bar",
            },
          },
          {
            id: "W0pkvrro",
            txt: "Updated due date",
            groupId: "g-05mqUAOd",
            createdAt: 1648369278955,
            task: {
              id: "t-nMLMX279",
              title: "Remove exess pixels between group-list and scroll bar",
            },
          },
          {
            id: "b5U2QiON",
            txt: "Change Labels",
            groupId: "g-05mqUAOd",
            createdAt: 1648369290122,
            task: {
              id: "t-nMLMX279",
              title: "Remove exess pixels between group-list and scroll bar",
            },
          },
          {
            id: "7It3Jw4j",
            txt: "save group title",
            createdAt: 1648369329171,
            group: {
              id: "g-va8kuIE2",
              title: "For later this week",
            },
          },
          {
            id: "3netnQsO",
            txt: "add task",
            createdAt: 1648369345283,
            group: {
              id: "g-va8kuIE2",
              title: "For later this week",
            },
          },
          {
            id: "5ec3PT7P",
            txt: "Change Labels",
            groupId: "g-va8kuIE2",
            createdAt: 1648369350698,
            task: {
              id: "t-0HhNSPhU",
              title: "Look at Quello for extra add-on ideas",
            },
          },
          {
            id: "Txn8Q0s6",
            txt: "add task",
            createdAt: 1648369395723,
            group: {
              id: "g102",
              title: "Components to Build",
            },
          },
          {
            id: "jZj19qyo",
            txt: "add task",
            createdAt: 1648369464026,
            group: {
              id: "g-05mqUAOd",
              title: "Feedback from Avior",
            },
          },
          {
            id: "CQttIpht",
            txt: "Change Labels",
            groupId: "g-05mqUAOd",
            createdAt: 1648369471149,
            task: {
              id: "t-FlDqD6BG",
              title:
                "Make sure to relax before the meeting with Asaf, and do a good job",
            },
          },
          {
            id: "wTFoRgEN",
            txt: "Change Labels",
            groupId: "g-05mqUAOd",
            createdAt: 1648369472114,
            task: {
              id: "t-FlDqD6BG",
              title:
                "Make sure to relax before the meeting with Asaf, and do a good job",
            },
          },
          {
            id: "YuMVHdES",
            txt: "Change Labels",
            groupId: "g-05mqUAOd",
            createdAt: 1648369474619,
            task: {
              id: "t-FlDqD6BG",
              title:
                "Make sure to relax before the meeting with Asaf, and do a good job",
            },
          },
          {
            id: "sCe6KWcd",
            txt: "Change Labels",
            groupId: "g-05mqUAOd",
            createdAt: 1648369477254,
            task: {
              id: "t-FlDqD6BG",
              title:
                "Make sure to relax before the meeting with Asaf, and do a good job",
            },
          },
          {
            id: "pa94Rc8n",
            txt: "Updated Description",
            groupId: "g-05mqUAOd",
            createdAt: 1648369511025,
            task: {
              id: "t-FlDqD6BG",
              title:
                "Make sure to relax before the meeting with Asaf, and do a good job",
            },
          },
          {
            id: "fk7jMogv",
            txt: "Updated due date",
            groupId: "g-05mqUAOd",
            createdAt: 1648369564076,
            task: {
              id: "t-J6zOG2sn",
              title: "Take a few pi",
            },
          },
          {
            id: "GkbtB5Wj",
            txt: "save group title",
            createdAt: 1648369582777,
            group: {
              id: "g102",
              title: "Components to Build",
            },
          },
          {
            id: "mUJFLJqX",
            txt: "add task",
            createdAt: 1648369658477,
            group: {
              id: "g102",
              title: "Components to Build",
            },
          },
          {
            id: "PcqvtoZs",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648369663901,
            task: {
              id: "t-VCawXr0K",
              title:
                "Render the data we have been collecting from the activities, the button to show and hide has been prepared",
            },
          },
          {
            id: "2jM4ahQR",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648369665708,
            task: {
              id: "t-VCawXr0K",
              title:
                "Render the data we have been collecting from the activities, the button to show and hide has been prepared",
            },
          },
          {
            id: "j6q98tUs",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648369667429,
            task: {
              id: "t-VCawXr0K",
              title:
                "Render the data we have been collecting from the activities, the button to show and hide has been prepared",
            },
          },
          {
            id: "ISNmFvAR",
            txt: "Updated due date",
            groupId: "g102",
            createdAt: 1648369677032,
            task: {
              id: "t-VCawXr0K",
              title:
                "Render the data we have been collecting from the activities, the button to show and hide has been prepared",
            },
          },
          {
            id: "a60GcWLC",
            txt: "save group title",
            createdAt: 1648369801257,
            group: {
              id: "g102",
              title: "Components to Build",
            },
          },
          {
            id: "aeWY4nye",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648369821021,
            task: {
              id: "c104",
              title: "Do that",
            },
          },
          {
            id: "pbYblrs5",
            txt: "Updated Description",
            groupId: "g102",
            createdAt: 1648369839129,
            task: {
              id: "c104",
              title: "Do that",
            },
          },
          {
            id: "r5smZnq2",
            txt: "add task",
            createdAt: 1648371305686,
            group: {
              id: "g102",
              title: "Components to Build",
            },
          },
          {
            id: "xbx7PIlZ",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648371313288,
            task: {
              id: "t-QzjP3br7",
              title: "Full CRUD of name and cards, without exception",
            },
          },
          {
            id: "n2Hh1vdy",
            txt: "updated due date status",
            groupId: "g102",
            createdAt: 1648372421123,
            task: {
              id: "c105",
              title: "Render and add comments",
            },
          },
          {
            id: "nZsE6loT",
            txt: "updated due date status",
            groupId: "g102",
            createdAt: 1648372423456,
            task: {
              id: "c105",
              title: "Render and add comments",
            },
          },
          {
            id: "wdOYGCff",
            txt: "Updated due date",
            groupId: "g-05mqUAOd",
            createdAt: 1648372610248,
            task: {
              id: "t-FlDqD6BG",
              title:
                "Make sure to relax before the meeting with Asaf, and do a good job",
            },
          },
          {
            id: "Hd2beyNT",
            txt: "added image",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648373006079,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "sFpDOclC",
            txt: "added image",
            groupId: "g-05mqUAOd",
            createdAt: 1648373021964,
            task: {
              id: "t-FlDqD6BG",
              title:
                "Make sure to relax before the meeting with Asaf, and do a good job",
            },
          },
          {
            id: "dX3EetsR",
            txt: "added image",
            groupId: "g101",
            createdAt: 1648373055028,
            task: {
              id: "t-TI4ANfXQ",
              title: "Render the photos to task preview",
            },
          },
          {
            id: "hM8PG5Pw",
            txt: "save group title",
            createdAt: 1648373139535,
            group: {
              id: "g-HIKOO3fg",
              title: "Plan for Backend",
            },
          },
          {
            id: "t8LDFpAF",
            txt: "add task",
            createdAt: 1648373155582,
            group: {
              id: "g-HIKOO3fg",
              title: "Plan for Backend",
            },
          },
          {
            id: "LUSVaFui",
            txt: "Updated due date",
            groupId: "g-HIKOO3fg",
            createdAt: 1648373163955,
            task: {
              id: "t-UEohipxO",
              title: "Make list of all potential bugs",
            },
          },
          {
            id: "YB2j4QxX",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648373182175,
            task: {
              id: "c104",
              title: "Proper layout and full CRUD of images",
            },
          },
          {
            id: "avUgqMSz",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648373185066,
            task: {
              id: "c104",
              title: "Proper layout and full CRUD of images",
            },
          },
          {
            id: "1oxnrHrf",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648373185950,
            task: {
              id: "c104",
              title: "Proper layout and full CRUD of images",
            },
          },
          {
            id: "I8AfnCeK",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648373186906,
            task: {
              id: "c104",
              title: "Proper layout and full CRUD of images",
            },
          },
          {
            id: "ZTDq4Kag",
            txt: "Change Labels",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648373683999,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "5UCdn61P",
            txt: "Change Labels",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648373687858,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "DLtWg9TA",
            txt: "Change Labels",
            groupId: "g101",
            createdAt: 1648373886086,
            task: {
              id: "t-TI4ANfXQ",
              title: "Render the photos to task preview",
            },
          },
          {
            id: "hgAfsbaq",
            txt: "updated due date status",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648373919422,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "Zgxes34w",
            txt: "updated due date status",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648373921247,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "cpklmrLH",
            txt: "updated due date status",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648373941156,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "2HzfmzeT",
            txt: "updated due date status",
            groupId: "g-Wen1SpyZ",
            createdAt: 1648373950964,
            task: {
              id: "t-yNkTEECH",
              title:
                "Reduce number of default labels on the boards to maximim of 6",
            },
          },
          {
            id: "PFGtTe2z",
            txt: "add task",
            createdAt: 1648373985130,
            group: {
              id: "g-va8kuIE2",
              title: "For later this week",
            },
          },
          {
            id: "GvqmcnAR",
            txt: "Updated due date",
            groupId: "g-va8kuIE2",
            createdAt: 1648374000642,
            task: {
              id: "t-U5qT2Gud",
              title: "Full working filter",
            },
          },
          {
            id: "EEOxWqqY",
            txt: "Change Labels",
            groupId: "g-va8kuIE2",
            createdAt: 1648374006294,
            task: {
              id: "t-U5qT2Gud",
              title: "Full working filter",
            },
          },
          {
            id: "hEqZEU2e",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648375093084,
            task: {
              id: "c105",
              title: "Render and add comments",
            },
          },
          {
            id: "ptnvPaty",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648375269313,
            task: {
              id: "c104",
              title: "Proper layout and full CRUD of images",
            },
          },
          {
            id: "pSWmQ9Gt",
            txt: "Change Labels",
            groupId: "g102",
            createdAt: 1648375269877,
            task: {
              id: "c104",
              title: "Proper layout and full CRUD of images",
            },
          },
        ],
      },
    ];
    utilService.saveToStorage(KEY, boards);
  }
  return boards;
}
