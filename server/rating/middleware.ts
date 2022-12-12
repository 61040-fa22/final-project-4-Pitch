import type {NextFunction, Request, Response} from "express";
import {Types} from 'mongoose';
import RatingCollection from "./collection";
import Categories from "./categories";

/**
 * Checks if signed-in user has not already rated content
 * If they have throw 409 error
 */
const hasUserNotRatedContentInCategory = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId;
  const contentId = req.params.contentId;
  const category = (req.query.category as string) ?? '';
  const rating = await RatingCollection.findOne(userId, contentId);

  if (rating !== null && category in rating.ratings) {
    res.status(409).json({
      error: {
        userHasAlreadyRated: `userId=[${userId}] has already rated contentId=[${contentId}] in category=[${category}] with score=[${rating.ratings[category]}]`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if signed-in user has already rated content in category
 * If they have not, throw 409 error
 */
const hasUserRatedContentInCategory = async (req: Request, res: Response, next: NextFunction) => {
  const contentId = req.params.contentId;
  const userId = req.session.userId;
  const rating = await RatingCollection.findOne(userId, contentId);

  const category = (req.query.category as string) ?? '';

  if (rating === null || !(category in rating.ratings)) {
    res.status(409).json({
      error: {
        userHasNotRated: `userId=[${userId}] has not rated contentId=[${contentId}] in category=[${category}]`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if user has rated any part of content
 */
const hasUserRatedContent = async (req: Request, res: Response, next: NextFunction) => {
  const contentId = req.params.contentId;
  const userId = req.session.userId;
  const rating = await RatingCollection.findOne(userId, contentId);

  if (rating === null) {
    res.status(409).json({
      error: {
        userHasNotRated: `userId=[${userId}] has not rated contentId=[${contentId}]`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if score is valid
 * If not, throw 400 error
 */
const isValidScore = async (req: Request, res: Response, next: NextFunction) => {
  const score = (req.body.score as number) ?? 101;
  const in_range = score >= 0 && score <= 100;

  if (!in_range) {
    res.status(400).json({
      error: {
        invalidScore: `score ${req.body.score} is either not a number or not in [0, 100]`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if category is one of the valid categories
 * Throw 400 if not
 */
const isValidCategory = async (req:Request, res: Response, next: NextFunction) => {
  const category = (req.query.category as string) ?? '';

  if (!(category in Categories)) {
    res.status(400).json({
      error: {
        invalidCategory: `category ${category} is not one of the valid categories. Valid categories are: ${Categories}`
      }
    });
    return;
  }

  next();
};

export {
  hasUserRatedContentInCategory,
  hasUserRatedContent,
  hasUserNotRatedContentInCategory,
  isValidScore,
  isValidCategory
};
