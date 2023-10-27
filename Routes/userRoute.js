const express = require("express");

const {
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
  uploadProfileImage,
  imageProfilePrecessing,
  updatePassword,
  getMyData,
  updateMyPassword,
  updateMe,
  deleteMe,
} = require("../Services/userService");
const {
  createUserValidator,
  UserIdValidator,
  changePasswordValidator,
  updateUserValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const AuthService = require("../Services/authService");

const router = express.Router();
router.use(AuthService.auth); // middleware for all routes

//                  User
router.get("/getMe", getMyData, getUser);
router.put("/updateMyPassword", changePasswordValidator, updateMyPassword);
router.put(
  "/updateMe",
  uploadProfileImage,
  imageProfilePrecessing,
  updateLoggedUserValidator,
  updateMe
);
router.delete("/deleteMe", deleteMe);

//                  Admin
router.post(
  "/",
  AuthService.allowedTo("admin"),
  uploadProfileImage,
  imageProfilePrecessing,
  createUserValidator,
  createUser
);
router.get("/", AuthService.allowedTo("admin", "manager"), getUsers);
router.get("/:id", AuthService.allowedTo("admin"), UserIdValidator, getUser);
router.put(
  "/:id",
  AuthService.allowedTo("admin"),
  uploadProfileImage,
  imageProfilePrecessing,
  UserIdValidator,
  updateUserValidator,
  updateUser
);
router.delete(
  "/:id",
  AuthService.allowedTo("admin"),
  UserIdValidator,
  deleteUser
);
router.put(
  "/updatePassword/:id",
  AuthService.allowedTo("admin"),
  UserIdValidator,
  changePasswordValidator,
  updatePassword
);

module.exports = router;
