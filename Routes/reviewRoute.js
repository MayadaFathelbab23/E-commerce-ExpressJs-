const express = require("express");
const {
  createReview,
  updateReview,
  getReview,
  getReviews,
  deleteReview,
  creatFilterObj,
  setProductandUser
} = require("../Services/reviewService");
const {
 createReviewVlidator,
 updateReviewValidator,
 deleteReviewValidator
} = require("../utils/validators/reviewsValidator");
const AuthService = require("../Services/authService");

const router = express.Router({mergeParams : true});

router.get("/", creatFilterObj , getReviews);
router.get("/:id", getReview);
router.post(
  "/",
  AuthService.auth,
  AuthService.allowedTo('user'),
  setProductandUser,
  createReviewVlidator,
  createReview
);
router.put(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo('user'),
  updateReviewValidator,
  updateReview
);
router.delete(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin" , 'user' , 'manager'),
  deleteReviewValidator,
  deleteReview
);

module.exports = router;
